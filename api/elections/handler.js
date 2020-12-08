'use strict';
const votes = require('./votes');

function buildResponse(body, success) {
  const code = success ? 200 : 500;
  return {
    statusCode: code,
    body: JSON.stringify(body)
  };
}

module.exports = {
  reportPrecinctVotes: async event => {    
    console.log(`event body: ${event.body}`);
    const voteData = JSON.parse(event.body);
    
    const resp = await votes.reportPrecinctVotes(voteData);
    console.log(`response: ${resp}`);
    return buildResponse(resp, resp.success);
  },
  
  getStateVotes: async event => {
  
  },
  
  getNationwidetotals: async event => {
  
  },
  
  getStateProbability: async event => {
  }
}
