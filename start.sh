#!/bin/bash

# server start script
# at least for backend lol
cd api
export FLASK_ENV=development
export FLASK_APP=api_main.py
flask run --host 0.0.0.0 --post 80