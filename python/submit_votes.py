#!/usr/bin/python3
import json
import requests
import sys
import time
import random
from County import County

url = 'https://ip6rswdf3m.execute-api.us-west-2.amazonaws.com/dev/votes/report'
def getStateData(state):
    print('getting state voting data for {}'.format(state))
    stateData = {}
    stateFile = '../web/dashboard/public/data/votes/' + state + '.json'
    print('reading state data from {}'.format(stateFile))
    with open(stateFile) as reader:
        stateData = json.load(reader)
    return stateData

def submitPrecinctVotes(precinct, state):
    payload = {
        'state': state,
        'precinct': precinct['name'],
        'county': precinct['county'],
        'voteData': precinct
        }
    r = requests.post(url, data=json.dumps(payload))
    print(r)

def submitVotes(state, delay):
    print('submitting votes for {} with a {} second delay between precincts'.format(state, delay))
    counties = []
    county_dictionary = getStateData(state)
    for k,v in county_dictionary.items():
        v['name'] = k
        county = County(v)        
        counties.append(county)

    print('loaded {} counties'.format(len(counties)))
    counties_left = len(counties) > 0
    while counties_left:
        index = random.randint(0, len(counties) - 1)
        nextCounty = counties[index] 
        nextCountyName = nextCounty.name
        print('pulled random county: {}'.format(nextCountyName))
        nextPrecinct = nextCounty.next_precinct_votes()
        submitPrecinctVotes(nextPrecinct, state)
        time.sleep(int(delay))
        counties_left = len(counties)


if __name__ == "__main__":
    state = sys.argv[1]
    delay = sys.argv[2]
    submitVotes(state, delay)
