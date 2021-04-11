from flask import Flask, render_template, request
import json

import gmail
from database import table

app = Flask(__name__)


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/test', methods=['GET'])
def test():
    return render_template('test.html')

@app.route('/profile', methods=['GET'])
def profile():
    #  takes a user json
    userid = request.headers['userid']

    usr="""{
    "id": "110110", 
    "name": "Thomas", 
    "email": "tvarano@umd.edu", 
    "total_packages": 25, 
    "total_carbon": 101, 
    "total_miles": 1000
    }"""

    pkg="""[{
    "id": "100100", 
    "user_id": "100100", 
    "tracking": "100100", 
    "weight": 10.2, 
    "length": 0.5, 
    "width": 0.5, 
    "height": 0.5, 
    "volume": 0.125, 
    "origin": "New York City, NY", 
    "ship_date": "2020-11-05", 
    "destination": "Seoul, South Korea", 
    "transportation": "plane", 
    "carbon": 102
    }, 
    {
    "id": "100100", 
    "user_id": "100100", 
    "tracking": "100100", 
    "weight": 10.2, 
    "length": 0.5, 
    "width": 0.5, 
    "height": 0.5, 
    "volume": 0.125, 
    "origin": "New York City, NY", 
    "ship_date": "2020-11-05", 
    "destination": "Seoul, South Korea", 
    "transportation": "plane", 
    "carbon": 102
    }, 
    {
    "id": "100100", 
    "user_id": "100100", 
    "tracking": "100100", 
    "weight": 10.2, 
    "length": 0.5, 
    "width": 0.5, 
    "height": 0.5, 
    "volume": 0.125, 
    "origin": "New York City, NY", 
    "ship_date": "2020-11-05", 
    "destination": "Seoul, South Korea", 
    "transportation": "plane", 
    "carbon": 102
    }]"""

    return render_template('profile.html', user=json.loads(usr), packages=json.loads(pkg))

@app.route('/loading')
def load(): 
    # query all package information
    # list chronologically in table

    # get json data 
    return render_template('loading.html')

@app.route('/login')
def login(): 
    usr = gmail.get_tracking_numbers()
    table.add
    return redirect(url_for('login'))

# if user exists, just scrape
# otherwise, add


# def scrape(): 
    # call gmail api scrape
    # get the info as json
    # save to db all the packages. 

    # recalculate user statistics

if __name__ == "__main__":
    app.run(debug=True)