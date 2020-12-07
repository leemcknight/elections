const { rejects } = require('assert');
const aws = require('aws-sdk');

const docClient = new aws.DynamoDB.DocumentClient();

const reportPrecinctVotes = voteData => {
    console.log(`voteData: ${voteData}`);
    const state = voteData.state;
    const precinct = voteData.precinct;
    const county = voteData.county;

    var params = {
        TableName: 'precinct_votes',
        Item: {
            'state' : {S: state},        
            'precinct' : {S: precinct},
            'county' : {S: county},
            'voteData' : voteData
        }
    };

    let response;
        
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            response = {
                success: false,
                errorResopnse: err
            }   
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            response = {
                success: true                
            }
        }
    });

    return response;
}

const getStateVotes = async state => {
    //get all records for state
    var params = {
        TableName: 'precinct_votes',
        KeyConditionExpression: '#state = :state',
        ExpressionAttributeNames: {
            '#state': 'state'
        },
        ExpressionAttributeValues: {
            ':state': state
        }
    }

    docClient.query(params, (err, data) => {
        if(err) {
            reject(err);
        } else {            
            const precincts = data.Items;
            console.log(precincts);
        }
    });

    //iterate over votes
    let countyResults = [];
    for(precinct of precincts) {
        const precinctCounty = precinct.county;
        const countyRecord = countyResults.find(county => county.county == precinctCounty);
        if(!countyRecord) {
            countyRecord = {
                county: precinctCounty,
                precinctCount: precinct.countyPrecinctCount,
                precictsReporting: 0
            }                
        }

        const precinctsReporting = countyRecord.precictsReporting + 1;
        countryRecord.candidates;


        const precinct = precinct.precinct;
        countyResults.push({

        })
        //candidates[precinct.]
    }

    const result = {
        state: state,
        counties: countyResults
    };

    return result;
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