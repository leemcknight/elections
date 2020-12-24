#!/usr/bin/python3
import csv
import sys
import json
import requests

counties = {} 
precincts = {}
url = 'https://ip6rswdf3m.execute-api.us-west-2.amazonaws.com/dev/countyTotals/report'

def postCountyTotals(state):
    for county in counties:
        print(county)
        print(counties[county])
        totals = {
            'state': state.upper(),
            'county': county.upper(),
            'voteCount': counties[county]['vote_count'],
            'precinctCount': counties[county]['precinct_count']
        }
        response = requests.post(url, data = json.dumps(totals))
        print(response)

def addPrecinctData(data):
    county = data['jurisdiction']
    votes = data['votes']
    new_precinct = True
    if(precincts.get(data['precinct'])):
        new_precinct = False
    else:
        precincts[data['precinct']] = 1

    countyData = counties.get(county)
    if countyData:
        currentVotes = int(countyData['vote_count'])
        currentPrecincts = int(countyData['precinct_count'])
        countyData['vote_count'] = currentVotes + int(votes)
        if(new_precinct):
            countyData['precinct_count'] = currentPrecincts + 1
    else:
        countyData = {
                'precinct_count': 1,
                'vote_count': int(votes)
            }
        counties[county] = countyData

def loadFile(file, state):
    with open(file) as recs:
        voteReader = csv.DictReader(recs, delimiter='\t')
        for vote in voteReader:
            if vote['state_postal'] == state:
                addPrecinctData(vote)
    postCountyTotals(state)

if __name__ == "__main__":
    loadFile(sys.argv[1], sys.argv[2])
