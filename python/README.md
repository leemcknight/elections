## Python Scripts

# precinct-metadata.py
  - usage: ./precinct-metadata.py [file] [state]
  - parses the given file and builds precinct-level vote totals for all
    candidates.  Writes the output to as json to {state}.json
  - groups the precincts by county.
# county-metadata.py
  - usage: ./county-metadata.py [file] [state]
  - parses the given file and sends county-level precict and vote counts to the rest webservice
# submit-votes.py
# submit-registrations.py
