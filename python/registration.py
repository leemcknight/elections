import csv

registrationFile = '../data/florida_2016_registrations.txt'

def readRegistrations(state):
    with open(registrationFile) as recs:
        reader = csv.reader(recs, delimiter=' ')
        for registration in reader:
            print(registration)

