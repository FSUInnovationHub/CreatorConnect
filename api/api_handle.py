from flask import request, redirect, flash, session, url_for, make_response, render_template
from api_main import app, mongo
from response import Response
import bcrypt
import json
from flask.sessions import SecureCookieSessionInterface
import time
from bson.objectid import ObjectId

app.secret_key = 'mysecret' 

#global booleans that will keep track of errors
wrongPassword = False 
nonexistentUser = False
existentUser = False
person = ""
passwordForChange = ""
graduYear = int
skillsForChange = []

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
        return redirect("http://localhost:3000/cards")
    else:
        wrongPassword = False
        nonexistentUser = False
        existentUser = True
        return redirect("http://localhost:3000/cards")

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
        return redirect("http://localhost:3000/cards")
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
            return redirect("http://localhost:3000/cards")
        else:
            wrongPassword = True
            nonexistentUser = False
            existentUser = False
            return redirect("http://localhost:3000/cards")
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
  return redirect("http://localhost:3000/")

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
    session.pop('username')
    mongo.db.users.delete_one({'name': person}) 
    return redirect("http://localhost:3000/")

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


    return redirect("http://localhost:3000/cards")
#
      #})
@app.route('/projects', methods=['GET', 'POST'])
def home():
  global person
  global projTitle
  global projDescrip
  global projSkillsForChange
  global projUrl
  global projEmail

  if request.method == 'GET':   
    return render_template('projects.html')
  if request.method == 'POST':
    document = request.form.to_dict()
    projTitle = document['projectTitle']
    projDescrip = document['name']

    projSkillsForChange = [document['firstSkill'], document['secondSkill'], document['thirdSkill'], document['fourthSkill'], document['fifthSkill']]
    projEmail = document['email']
    projUrl = document['url']
    mongo.db.projects.insert_one({'user who created':person, 'projTitle': projTitle, 'projDescrip':projDescrip, 'skills':projSkillsForChange, 'url':projUrl, 'email':projEmail})
    return redirect("http://localhost:5000/projectsRand")

@app.route('/myProjects/')
def myProjects():
  # Returns user specified object
  projectsByUsers = list(mongo.db.projects.find({'user who created' : person}))

  return Response(200, projectsByUsers).serialize()

@app.route('/changeProjInfo')
def changeProjInfo():
  global projTitle
  global projDescrip
  global projSkillsForChange
  global projUrl
  global projEmail
  document = request.form.to_dict()
  ProjemailEntered = document['fsuEmail'].lower()
  #search for email in DB
  user = mongo.db.projects.find({'email': ProjemailEntered})
  projTitle = user['projTitle']
  projDescrip = user['projDescrip']
  projSkillsForChange = user['skills']
  projUrl = user['url']
  projEmail = user['email']

    #skillsArray = [document['firstSkill'], document['secondSkill'], document['thirdSkill'], document['fourthSkill'], document['fifthSkill']]
  emailName = document['email']
  urlLink = document['url']
  mongo.db.projects.insert_one({'projTitle': projTitle, 'projDescrip':projDescrip}) #'skills':skillsArray, 'url':urlLink, 'email':emailName})
  return redirect("http://localhost:5000/projectsRand")

@app.route('/username')
def returnUsername():
  global person
  return person