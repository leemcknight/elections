#!/usr/bin/python3
import json
import requests
import csv
import sys
import requests

url = 'https://ip6rswdf3m.execute-api.us-west-2.amazonaws.com/dev/registrations/report'

def submit_registration(state, county, republican_voters, democratic_voters):
    payload = {
            "state": state,
            "county": county,
            "republican": republican_voters,
            "democrat": democratic_voters
            }
    response = requests.post(url, data = json.dumps(payload))
    print(response)


def submitRegistrations(state, registration_file):
    with open(registration_file) as reader:
        csv_reader = csv.DictReader(reader, delimiter=' ')
        for row in csv_reader:
            print(row)
            county = row['COUNTY']
            republican = row['REPUBLICAN']
            democrat = row['DEMOCRAT']
            submit_registration(state, county, republican, democrat)

if __name__ == "__main__":
    state = sys.argv[1]
    registration_file = sys.argv[2]
    submitRegistrations(state, registration_file)
