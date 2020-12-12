## Elections project

# Overview
## Simulates election returns at a precinct level and provides and api layer and web (react) application to view election status county by county, state by state, or nationwide.

## Stack
* API - nodeJS running in Lambda, managed by Serverless.  Fronted by API Gateway
* Database - DynamoDb
* Scripts - Python scripts that handle the following:
    -Given a state and a delay (in seconds) regularly reports precinct vote total across the state with the given delay between reports.  Ivokes the reportPrecinctVotes api
- A script, given a file contianing nationwide, precinct-level votes, splits the file into individual states for easier consumption
* Web - reactJS project that invokes the API layer to retrieve county-by-county results and displays them on a map.  Calculates bot state and nationwide totals for display as well.
