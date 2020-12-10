import random

class County:
    def __init__(self, countyData):
        self.precincts = countyData['precincts']
        self.name = countyData['name']
        print('created {} with {} precincts.'.format(self.name, len(self.precincts)))

    def next_precinct_votes(self):
        precinctsLeft = len(self.precincts)
        if (precinctsLeft == 0):
            return None

        index = random.randint(0, precinctsLeft - 1)
        nextPrecinctName = list(self.precincts.keys())[index] 
        nextPrecinct = self.precincts.pop(nextPrecinctName) 
        print('pulled random precinct from {}: {}'.format(self.name, nextPrecinctName))
        return nextPrecinctName, nextPrecinct
