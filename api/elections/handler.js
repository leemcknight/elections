'use strict';
const votes = require('./votes');
const registrations = require('./registrations');

function buildResponse(body, success) {
  const code = success ? 200 : 500;
  return {
    statusCode: code,
    headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
    body: JSON.stringify(body)
  };
}

module.exports = {
  reportPrecinctVotes: async event => {        
    const voteData = JSON.parse(event.body);
    
    const resp = await votes.reportPrecinctVotes(voteData);
    console.log(`response: ${resp}`);
    return buildResponse(resp, resp.success);
  },

  reportRegistrations: async event => {
    const registrationData = JSON.parse(event.body);
    
    const resp = await registrations.reportRegistrations(registrationData);
    console.log(`response: ${resp}`);
    return buildResponse(resp, resp.success);
  },

  reportCountyTotals : async event => {
    const countyData = JSON.parse(event.body);
    
    const resp = await registrations.reportCountyTotals(countyData);
    console.log(`response: ${resp}`);
    return buildResponse(resp, resp.success);
  },
  
  getStateVotes: async event => {
    const {state} = event.pathParameters;
    const resp = await votes.getStateVotes(state);    
    return buildResponse(resp, true);
  },

  getRegistrations: async event => {
    const {state} = event.pathParameters;
    const resp = await registrations.getRegistrations(state);    
    return buildResponse(resp, true);
  },
  
  getNationwidetotals: async event => {
  
  },
  
  getStateProbability: async event => {
  }
}
