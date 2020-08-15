import connect
import sys
import json
from os import environ
from flask import Flask, jsonify, json, request, redirect, session, url_for, make_response, render_template
from bson import json_util
from flask_pymongo import PyMongo
import pymongo
from flask_cors import CORS as cors
from pymongo.errors import ConfigurationError, OperationFailure
from bson.objectid import ObjectId
import bcrypt
import json
from pymongo import MongoClient
from flask.sessions import SecureCookieSessionInterface
import time

class Response:
    def __init__(self, code, data, *args):
        # An HTTP Response code
        # See a list here: https://www.restapitutorial.com/httpstatuscodes.html
        self.code = code

        # Use getResponseData to get status and message params.
        self.status = getResponseData(code)['status']
        self.message = getResponseData(code)['message']

        # Pass thru data from constructor.
        #print("data = ", data)
        self.data = data

        # Pass thru optional errorData dict, to help describe an error.
        self.errorData = args[0] if len(args)>0 else {}

    def serialize(self):
        return json_util.dumps(self.__dict__), {'Content-Type': 'application/json; charset=utf-8'}

def getResponseData(code):
    # Dict containing all possible response codes
    possibleCodes = {
        200: {"status": "Success", "message": "The request completed successfully"}
    }

    # errObj, the default response when a code is not found in the possibleCodes dict
    errObj = {"status": "Fatal Error", "message": "The code returned does not correspond with a status! Contact an admin for help."}

    # Return the code's corresponding dict
    return possibleCodes.get(code, errObj)

uri = connect.CONNECTION_STRING
client = MongoClient(uri)

# Init Flask App
app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = False
app.config['SESSION_REFRESH_EACH_REQUEST'] = False
app.secret_key = 'mysecret'

cors(app, resources={r"*": {"origins": "*"}}, headers=['Content-Type'], expose_headers=['Access-Control-Allow-Origin'], supports_credentials=True)

# Init MongoDB Connection and run sample query to test authentication
app.config["MONGO_URI"] = uri
mongo = PyMongo(app)


# Now that app is initialized, import other paths
# Import all get requests
# Index
#global booleans that will keep track of errors
wrongPassword = False
nonexistentUser = False
existentUser = False
person = ""
passwordForChange = ""
graduYear = int
skillsForChange = []

#DATA
@app.route('/')
def index():
    return Response(200, {}).serialize()

@app.route('/userCount')
def userCount():
    totalUsers = mongo.db.users.count()
    return Response(200, totalUsers).serialize()
# /users

# /randUsers
@app.route('/allRandUsers')
def listRandomUsers():
    # Search for random users and typecast to list
    numUsers = mongo.db.users.count()
    users = list(mongo.db.users.aggregate([ { "$sample": { "size": numUsers } } ]))

    # Return new response object formatted with users
    return Response(200, users).serialize()


#ACTIONS
@app.route('/register', methods=['POST'])
def createNewUser():
    global wrongPassword
    global nonexistentUser
    global existentUser
    global person
    global email
    global passwordForChange
    global graduYear
    global skillsForChange
    document = request.form.to_dict()
    name = (document['firstName'].lower()).capitalize() + ' ' + (document['lastName'].lower()).capitalize()
    emailEntered = document['fsuEmail'].lower()
    # TODO: Add verification for fsu.edu email // also email existence module

    #search to see if a user with this email already exists
    user = mongo.db.users.find_one({'email': emailEntered})

    rawPassword = document['password']
    rawPassword.encode('utf-8')
    hashedPassword = bcrypt.hashpw(rawPassword.encode('utf8'), bcrypt.gensalt())
    skillsArray = [document['firstSkill'], document['secondSkill'], document['thirdSkill'], document['fourthSkill'], document['fifthSkill']]

    #based on the response send through, booleans explain the routes
    if user is None:
        wrongPassword = False
        nonexistentUser = False
        existentUser = False
        mongo.db.users.insert_one({'name': name, 'email': document['fsuEmail'].lower(), 'hashedPassword': hashedPassword, 'gradYear': document['gradYear'], 'skills': skillsArray})
        user = mongo.db.users.find_one({'email': emailEntered})

        session['username'] = str(user['_id'])
        person = user['name']
        email = user['email'].lower()
        passwordForChange = user['hashedPassword']## need to go to hashed password later to really change
        graduYear = user['gradYear']
        skillsForChange = user['skills']
        return redirect("https://creatorconnect.netlify.com/cards")
    else:
        wrongPassword = False
        nonexistentUser = False
        existentUser = True
        return redirect("https://creatorconnect.netlify.com/cards")

@app.route('/login', methods=['POST', 'GET'])
def login():
  global wrongPassword
  global nonexistentUser
  global existentUser
  global person
  global email
  global passwordForChange
  global graduYear
  global skillsForChange
  if request.method == 'POST':
    document = request.form.to_dict()
    emailEntered = document['fsuEmail'].lower()
    passwordEntered = document['password']

    #search for email in DB
    user = mongo.db.users.find_one({'email': emailEntered})

    #based on the response send through, booleans explain the routes
    if user is None:
        wrongPassword = False
        nonexistentUser = True
        existentUser = False
        return redirect("https://creatorconnect.netlify.com/cards")
    else:
        if (bcrypt.checkpw(passwordEntered.encode('utf8'), user['hashedPassword'])):
            wrongPassword = False
            nonexistentUser = False
            existentUser = False
            session['username'] = str(user['_id']) #signs user in
            person = user['name']
            email = user['email'].lower()
            passwordForChange = user['hashedPassword']## need to go to hashed password later to really change
            graduYear = user['gradYear']
            skillsForChange = user['skills']
            return redirect("https://creatorconnect.netlify.com/cards")
        else:
            wrongPassword = True
            nonexistentUser = False
            existentUser = False
            return redirect("https://creatorconnect.netlify.com/cards")
  elif request.method == 'GET':
    if 'username' in session:
      return "0"

    else:
      if wrongPassword is True:
        wrongPassword = False
        nonexistentUser = False
        existentUser = False
        return "2"
      elif nonexistentUser is True:
        wrongPassword = False
        nonexistentUser = False
        existentUser = False
        return "3"
      elif existentUser is True:
        wrongPassword = False
        nonexistentUser = False
        existentUser = False
        return "1"

      else:
        wrongPassword = False
        nonexistentUser = False
        existentUser = False
        return "5"

#endponint to log user out using session.pop
@app.route('/logout', methods=['POST'])
def logout():
  session.pop('username')
  return redirect("https://creatorconnect.netlify.com/")

#experimental endpoint to avoid sending logged in users to the launch page
@app.route('/isLoggedIn', methods=['GET'])
def isLoggedIn():
  if 'username' in session:
    return "0"
  return "1"

@app.route('/delete', methods = ['GET'])
def delete():
  global person
  if request.method == 'GET':
    mongo.db.users.delete_one({'name': person})
    session.pop('username')
    return redirect("https://creatorconnect.netlify.com/")

@app.route('/changeInfo', methods = ['POST', 'GET'])
def changeInfo():
  global person
  global email
  global graduYear
  global skillsForChange
  if request.method == 'GET':
    return Response(200, {"name": str(person), "email": str(email), "gradYear": graduYear, "skills": skillsForChange }).serialize()
  if request.method == 'POST':
    document = request.form.to_dict()
    name = (document['firstName'].lower()).capitalize() + ' ' + (document['lastName'].lower()).capitalize()
    emailEntered = document['fsuEmail'].lower()

    skillsArray = [document['firstSkill'], document['secondSkill'], document['thirdSkill'], document['fourthSkill'], document['fifthSkill']]

    mongo.db.users.find_one_and_update({'name': person}, {'$set': {'name': name, 'email': emailEntered, 'gradYear': document['gradYear'], 'skills': skillsArray}})
    #search for email in DB
    user = mongo.db.users.find_one({'email': emailEntered})
    person = user['name']
    email = user['email']
    graduYear = user['gradYear']
    skillsForChange = user['skills']


    return redirect("https://creatorconnect.netlify.com/cards")
#
      #})

@app.route('/username')
def returnUsername():
  global person
  return person

if __name__ == '__main__':
    app.run()