#!/usr/bin/python3
import csv
import sys
import json

counties = {} 

def addPrecinctData(data):
    county = data['jurisdiction']
    precinct = data['precinct']
    candidate = data['candidate_normalized']
    precinctVotes = data['votes']

    print(county + '/' + precinct + '/' + candidate)
    countyData = counties.get(county)
    if countyData:
        precinctData = countyData['precincts'].get(precinct)
        if not precinctData:
            precinctData = {
                candidate: precinctVotes
                }
            countyData['precincts'][precinct] = precinctData
        else:
            precinctData[candidate] = precinctVotes
    else:
        countyData = {
            'precincts' : {
                precinct: {
                    candidate: precinctVotes
                    }
                }
            }
        counties[county] = countyData
        print(county + ' not found.  added: ')
        print(counties[county])


def loadFile(file, state):
    with open(file) as recs:
        voteReader = csv.DictReader(recs, delimiter='\t')
        for vote in voteReader:
            if vote['state_postal'] == state:
                addPrecinctData(vote)
    with open(state + '.json', 'w') as output:
        json.dump(counties, output)


if __name__ == "__main__":
    loadFile(sys.argv[1], sys.argv[2])
