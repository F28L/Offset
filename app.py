from flask import Flask, render_template, request
import json

import math

from utils import gmail, carbon_calculator, package_parser, shipengine
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
    userid = request.headers['useremail']

    conn = table.open_connection()
    usr = table.get_user(conn, userid)
    pkg = table.get_packages(conn, userid)

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
    conn = table.open_connection()
    
    usr = table.get_user(conn, user.email)
    if not usr: 
        table.add_user(conn, usr['name'], usr['email'])
    
    # get package info
    for (carrier, track) in usr['packages']: 
        details = shipengine.getDetails(carrier, track)
        breakdown = carbon_calculator.shortestRoute(coord_str(details['origin']), coord_str(details['destination']))
        # kg, cbm = dummy
        kg = 2
        cbm = 0.2
        lwh = math.sqrt(cmb)
        carbon = carbon_calculator.getCO2(coord_str(details['origin']), coord_str(details['destination']), breakdown, kg, cbm)

        table.add_package(conn, usr['email'], track, kg, lwh, lwh, lwh, cbm, f"{details['origin']['city']}, {details['origin']['state']}", '2021-11-04', f"{details['destination']['city']}, {details['destination']['state']}", breakdown['distance'], 'road', carbon)
        

    conn.close()

    response = redirect(url_for('profile'))
    response.headers = {'useremail': user['email']}  
    return response

def coord_str(location): 
    return f"{location['longitude']},{location['latitude']}"

# if user exists, just scrape
# otherwise, add

if __name__ == "__main__":
    app.run(debug=True)