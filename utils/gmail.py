# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'


from __future__ import print_function
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

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

# https://stackoverflow.com/questions/619977/regular-expression-patterns-for-tracking-numbers 
matchUPS1      = '/\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/'
matchUPS2      = '/^[kKJj]{1}[0-9]{10}$/'

matchUSPS0     = '/(\b\d{30}\b)|(\b91\d+\b)|(\b\d{20}\b)/'
matchUSPS1     = '/(\b\d{30}\b)|(\b91\d+\b)|(\b\d{20}\b)|(\b\d{26}\b)| ^E\D{1}\d{9}\D{2}$|^9\d{15,21}$| ^91[0-9]+$| ^[A-Za-z]{2}[0-9]+US$/i'
matchUSPS2     = '/^E\D{1}\d{9}\D{2}$|^9\d{15,21}$/'
matchUSPS3     = '/^91[0-9]+$/'
matchUSPS4     = '/^[A-Za-z]{2}[0-9]+US$/'
matchUSPS5     = '/(\b\d{30}\b)|(\b91\d+\b)|(\b\d{20}\b)|(\b\d{26}\b)| ^E\D{1}\d{9}\D{2}$|^9\d{15,21}$| ^91[0-9]+$| ^[A-Za-z]{2}[0-9]+US$/i'

matchFedex1    = '/(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)/'
matchFedex2    = '/\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b/'
matchFedex3    = '/^[0-9]{15}$/'

possible_tracking_numbers_regex = [matchUPS1, matchUPS2, matchUSPS0, matchUSPS1, matchUSPS2, matchUSPS3, matchUSPS4, matchUSPS5, matchFedex1, matchFedex2, matchFedex3]


tracking_numbers = []

def getEmails():
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
            creds = flow.run_local_server(port=8080)

        # Save the access token in token.pickle file for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    # Connect to the Gmail API
    service = build('gmail', 'v1', credentials=creds)

    # request a list of all the messages
    # result = service.users().messages().list(userId='me').execute()
    
    # # We can also pass maxResults to get any number of emails. Like this:
    result = service.users().messages().list(maxResults=10000, userId='me', q ='"tracking number"').execute()
    messages = result.get('messages')

    # messages is a list of dictionaries where each dictionary contains a message id.
    # iterate through all the messages
    for msg in messages:
        # Get the message from its id
        txt = service.users().messages().get(userId='me', id=msg['id']).execute()
        
        # Use try-except to avoid any Errors
        try:
            # print(txt)
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
            parts = payload.get('parts')[0]
            data = parts['body']['data']
            data = data.replace("-","+").replace("_","/")
            decoded_data = base64.b64decode(data)

            # Now, the data obtained is in lxml. So, we will parse
            # it with BeautifulSoup library
            soup = BeautifulSoup(decoded_data , "lxml")
            body = soup.body()

            ps = soup.find_all('p')
            As = [x.find_all('a') for x in list(ps)]
            nums = []
            for x in possible:
                print(x)
            # Printing the subject, sender's email and message
            # print("Subject: ", subject)
            # print("From: ", sender)
            # print("Message: ", body)
            # print('\n')
        except:
            pass

getEmails()

# returns the tracking numbers in an array
# also returns user email, name
# dict format
def get_user_info(): 
    return getEmails()
