import requests

API_KEY = 'TEST_Z1JCbxbL+lc+1FPHN5WQOFq3uLr5pjLYlzJym6sjm+g'
GOOGLE_MAPS_KEY = 'AIzaSyBQ86CvVJmcPksfusTgLaijoLq-deRsFmY'

def getZip(latitude, longitude):
    qs = {
        'latlng': str(latitude) + ',' + str(longitude),
        'key':GOOGLE_MAPS_KEY
    }
    
    r = requests.get(url='https://maps.googleapis.com/maps/api/geocode/json', params=qs)
    j = r.json()
    address_components = j['results'][0]['address_components']

    
    for a in address_components:
        if a['types'][0] == 'postal_code':
            return a['long_name']

def getDetails(carrier, tracking):
    qs = {
        'carrier_code':carrier,
        'tracking_number':tracking
    }

    url = "https://api.shipengine.com/v1/tracking?"

    headers = {
    'Host': 'api.shipengine.com',
    'API-Key': API_KEY
    }

    r = requests.get(url, headers=headers, params=qs)
    j = r.json()

    if carrier == 'ups':
        if j['carrier_status_description'] != "Invalid tracking number":
            firstevent = j['events'][-2] # First event is label printing, need to grab origin scan.
            origincity = firstevent['city_locality']
            originstate = firstevent['state_province']
            originlat = firstevent['latitude']
            originlong = firstevent['longitude']
            originzip = getZip(originlat, originlong)

            lastevent = j['events'][0] # First event is label printing, need to grab origin scan.
            destcity = lastevent['city_locality']
            deststate = lastevent['state_province']
            destlat = lastevent['latitude']
            destlong = lastevent['longitude']
            destzip = getZip(destlat, destlong)

            result = {
                'origin': {
                    'city': origincity,
                    'state': originstate,
                    'latitude': originlat,
                    'longitude': originlong,
                    'zip':originzip
                },
                'destination': {
                    'city': destcity,
                    'state': deststate,
                    'latitude': destlat,
                    'longitude': destlong,
                    'zip':destzip
                }
            }

    elif carrier == 'usps':
        if j['carrier_status_code'] != "-2147219283":
            firstevent = j['events'][-1] 
            origincity = firstevent['city_locality']
            originstate = firstevent['state_province']
            originlat = firstevent['latitude']
            originlong = firstevent['longitude']
            originzip = firstevent['postal_code']

            lastevent = j['events'][0] 
            destcity = lastevent['city_locality']
            deststate = lastevent['state_province']
            destlat = lastevent['latitude']
            destlong = lastevent['longitude']
            destzip = lastevent['postal_code']

            result = {
                'origin': {
                    'city': origincity,
                    'state': originstate,
                    'latitude': originlat,
                    'longitude': originlong,
                    'zip': originzip
                },
                'destination': {
                    'city': destcity,
                    'state': deststate,
                    'latitude': destlat,
                    'longitude': destlong,
                    'zip':destzip
                }
            }
    elif carrier == 'fedex':
        if j['carrier_status_code'] != None:
            if j['carrier_status_code'] != "-2147219283":
                firstevent = j['events'][-2] # First event is label printing, need to grab origin scan.
                origincity = firstevent['city_locality']
                originstate = firstevent['state_province']
                originlat = firstevent['latitude']
                originlong = firstevent['longitude']
                originzip = firstevent['postal_code']

                lastevent = j['events'][0] # First event is label printing, need to grab origin scan.
                destcity = lastevent['city_locality']
                deststate = lastevent['state_province']
                destlat = lastevent['latitude']
                destlong = lastevent['longitude']
                destzip = lastevent['postal_code']

                result = {
                    'origin': {
                        'city': origincity,
                        'state': originstate,
                        'latitude': originlat,
                        'longitude': originlong,
                        'zip': originzip
                    },
                    'destination': {
                        'city': destcity,
                        'state': deststate,
                        'latitude': destlat,
                        'longitude': destlong,
                        'zip':destzip
                    }
                }
    return result

