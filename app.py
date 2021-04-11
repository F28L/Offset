from flask import Flask, render_template, request
import json

import math

from utils import gmail, carbon_calculator, shipengine
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

    conn.close()

    return render_template('profile.html', user=usr, packages=pkg)

@app.route('/loading')
def load(): 
    # query all package information
    # list chronologically in table

    # get json data 
    return render_template('loading.html')

@app.route('/login')
def login(): 
    gmuser = gmail.getDataFromEmailInbox()
    conn = table.open_connection()
    
    user = table.get_user(conn, gmuser['email'])
    if not user : 
        table.add_user(conn, gmuser['name'], gmuser['email'])
    
    # get package info
    for (carrier, track) in gmuser['packages']: 
        details = shipengine.getDetails(carrier, track)
        if not details: 
            continue
        
        breakdown = carbon_calculator.shortestRoute(coord_str(details['origin']), coord_str(details['destination']))
        # kg, cbm = dummy
        kg = 2
        cbm = 0.2
        lwh = math.sqrt(cmb)
        carbon = carbon_calculator.getCO2(coord_str(details['origin']), coord_str(details['destination']), breakdown, kg, cbm)

        table.add_package(conn, user['email'], track, kg, lwh, lwh, lwh, cbm, f"{details['origin']['city']}, {details['origin']['state']}", '2021-11-04', f"{details['destination']['city']}, {details['destination']['state']}", breakdown['distance'], 'road', carbon)
        

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