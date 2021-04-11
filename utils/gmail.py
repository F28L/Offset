from __future__ import print_function
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

import datetime

# import the required libraries
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
import base64
import re
import email
from bs4 import BeautifulSoup

# Define the SCOPES. If modifying it, delete the token.pickle file.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def grab_tracking_number(body):
    number_set = set()
    usps = '([A-Z]{2}\d{9}[A-Z]{2}|(420\d{9}(9[2345])?)?\d{20}|(420\d{5})?(9[12345])?(\d{24}|\d{20})|82\d{8})'
    ups = '(1Z[A-H,J-N,P,R-Z,0-9]{16})'
    fedex = '\D([0-9]{12}|100\d{31}|\d{15}|\d{18}|96\d{20}|96\d{32})\D'

    pattern = re.compile(f'{usps}|{ups}|{fedex}')
    fedex_pattern = re.compile(fedex)
    usps_pattern = re.compile(usps)
    ups_pattern = re.compile(ups)
    
    existing = set()
    
    match = re.search(pattern, body)
    if fedex_pattern.match(match[0]):
        number = re.sub("[^0-9]", "", match[0])
        if number not in existing:
            number_set.add(('fedex', number))
            existing.add(number)
    elif usps_pattern.match(match[0]) and match[0] not in existing:
        if '2106' == match[0][0:4]:
            number_set.add(('ups', match[0]))
        else:
            number_set.add(('usps', match[0]))
        existing.add(match[0])
    elif ups_pattern.match(match[0]) and match[0] not in existing:
        number_set.add(('ups', match[0]))
        existing.add(match[0])

    return number_set

def getDataFromEmailInbox():
    data_dict = dict()
    # Variable creds will store the user access token.
    # If no valid token found, we will create one.
    creds = None

    # The file token.pickle contains the user access token.
    # Check if it exists
    if os.path.exists('token.pickle'):

        # Read the token from the file and store it in the variable creds
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    
    # If credentials are not available or are invalid, ask the user to log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=55160)

        # Save the access token in token.pickle file for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    # Connect to the Gmail API
    service = build('gmail', 'v1', credentials=creds)

    # request a list of all the messages
    # result = service.users().messages().list(userId='me').execute()
    profile = service.users().getProfile(userId = 'me').execute()

    # print(profile['emailAddress'].replace('@gmail.com', ''))
    data_dict['name'] = profile['emailAddress'].replace('@gmail.com', '')
    data_dict['email'] = profile['emailAddress']

    # # We can also pass maxResults to get any number of emails. Like this:
    t_minus120 = datetime.datetime.today() - datetime.timedelta(120)
    date_time = t_minus120.strftime("%Y/%m/%d/")

    result = service.users().messages().list(maxResults=10000, userId='me', q = 'after:' + date_time + ' "tracking number"').execute()
    messages = result.get('messages')

    # messages is a list of dictionaries where each dictionary contains a message id.
    # iterate through all the messages
    packages = list()
    for msg in messages:
        # Get the message from its id
        txt = service.users().messages().get(userId='me', id=msg['id']).execute()
        
        # Use try-except to avoid any Errors
        try:
            # Get value of 'payload' from dictionary 'txt'
            payload = txt['payload']
            headers = payload['headers']

            # Look for Subject and Sender Email in the headers
            for d in headers:
                if d['name'] == 'Subject':
                    subject = d['value']
                    # tracking_numbers.append(subject)
                if d['name'] == 'From':
                    sender = d['value']
            
            # The Body of the message is in Encrypted format. So, we have to decode it.
            # Get the data and decode it with base 64 decoder.
            # print(payload['parts'][0])
            if 'parts' not in payload.keys():
                data = payload['body']['data']
            else:
                data = payload['parts'][0]['body']['data']
            # print(data, sender)
            data = data.replace("-","+").replace("_","/")
            decoded_data = base64.b64decode(data)

            res = list(grab_tracking_number(decoded_data.decode("utf-8")))
            packages += res

        except Exception as e:
            # print(e, 'error')
            pass
        
    data_dict['packages'] = list(set(packages))
    return data_dict