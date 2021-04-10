import requests

def getCoordsFromZip(zip_code):
    qs = {
        'address':zip_code,
        'key':'AIzaSyB1uoqMgF_qCnQcqfffcHKGM8t9Xn1miNo'
    }
    
    r = requests.get(url='https://maps.googleapis.com/maps/api/geocode/json', params=qs)

    j = r.json()
    loc = j['results'][0]['geometry']['location']
    return (str(loc['lng']) + ',' + str(loc['lat']))

def shortestRoute(origin, dest):
    qs = {
        'dischargePort':'a',
        'from': origin,
        'loadingPort':'b',
        'route_mode': 'road', # change if need to change route
        'to': dest,
        'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMzA5NzRiMjZhNzFiMzNkNDA0ZDgzOCIsImlhdCI6MTYxODA4MzgxMn0.-x7T3xaKJnYcSsbDiatFfGPOIoAeg1SqWDRtykot8Dc'
    }

    r = requests.get(url='https://dhl-carboncalculator.com/api/shortest_route', params=qs)
    j = r.json()

    return j['breakdown']

def getCO2(origin, dest, breakdown, kgs, cbm):
    origin = origin.split(',')
    fromlng = origin[0]
    fromlat = origin[1]

    dest = dest.split(',')
    tolng = dest[0]
    tolat = dest[1]

    data = {
        "kgs": kgs,
        "cbm": cbm,
        "ftl": False,
        "fcl": False,
        "co2": 0,
        "co2_efficiency": 0,
        "distance": 0,
        "showMap": False,
        "enableFcl": False,
        "legs": [
            {
            "from": {
                "value": "ab",
                "state": "a",
                "country": "a",
                "geo": [
                float(fromlng),
                float(fromlat)
                ],
                "display": "a"
            },
            "to": {
                "value": "asdf",
                "state": "a",
                "country": "a",
                "geo": [
                float(tolng),
                float(tolat)
                ],
                "display": "a"
            },
            "searchFrom": "a",
            "searchTo": "b",
            "mode": "road",
            "showMap": False,
            "showActions": False,
            "changeMode": True,
            "index": 0,
            "action": "",
            "fromAction": "",
            "displayIndex": 0,
            "breakdown": breakdown
            }
        ],
        "showRouteProgress": False,
        "routeDisplayed": True,
        "index": 0,
        "role": "dummy"
    }

    r = requests.post(url='https://dhl-carboncalculator.com/api/save_scenario', json=data)
    j = r.json()

    return j['scenario']['legs'][0]['total_co2']

northbrook = getCoordsFromZip('60062')
cp = getCoordsFromZip('20742')

breakdown = shortestRoute(northbrook, cp)
grams = getCO2(northbrook, cp, breakdown, 1, 0.1)

