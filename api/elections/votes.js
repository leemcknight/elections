const { rejects } = require('assert');
const aws = require('aws-sdk');
const {convertStateResponse} = require('./dynamoHelper');

const docClient = new aws.DynamoDB.DocumentClient();

const reportPrecinctVotes = async voteData => {
    console.log(`voteData: ${JSON.stringify(voteData)}`);
    const state = voteData.state;
    const precinct = voteData.precinct;
    const county = voteData.county;
    const voteJson = JSON.stringify(voteData.voteData);

    var params = {
        TableName: 'precinct_votes',
        Item: {
            'state' : state,        
            'precinct' : precinct,
            'county' : county,
            'voteData' : voteJson
        }
    };

    let response;
        
    return new Promise( (resolve, reject ) =>  docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            response = {
                success: false,
                errorResponse: err
            } 
            reject(err);
        } else {            
            response = {
                success: true                
            }
            resolve(response);
        }
    }));    
}

const getStateVotes = async state => {
    //get all records for state
    var params = {
        TableName: 'precinct_votes',
        FilterExpression: '#state = :state',
        ExpressionAttributeNames: {
            '#state': 'state'
        },
        ExpressionAttributeValues: {
            ':state': state
        }
    }

    const result = await new Promise( (resolve, reject) => docClient.scan(params, (err, data) => {
        if(err) {
            reject(err);
        } else {                    
            console.log(`data: ${data}`);
            resolve(data.Items);
        }
    }));

    const precincts = convertStateResponse(result);

    const stateResult = {
        state: state,
        counties: precincts
    };

    return stateResult;
}

const getNationwideTotals = () => {

}

const getStateProbability = state => {
    return {
        state: 'FL',
        candidates: [
            {
                candidate: {
                    candidateName: 'Donald Trump',
                    candidateLastName: 'Trump',
                    likelyhod: 45.5,
                }                
            },
            {
                candidate: {
                    candidateName: 'Hillary Clinton',
                    candidateLastName: 'Clinton',
                    likelyhod: 54.5,
                }                
            }
        ]
    }
}

module.exports = {
    getStateVotes,
    getStateProbability,
    getNationwideTotals,
    reportPrecinctVotes
};