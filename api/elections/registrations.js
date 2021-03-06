const { rejects } = require('assert');
const aws = require('aws-sdk');
const {convertRegistrationResponse} = require('./dynamoHelper');

const docClient = new aws.DynamoDB.DocumentClient();

const reportRegistrations = async registrations => {
    console.log(`registrations: ${JSON.stringify(registrations)}`);
    const state = registrations.state;
    const county = registrations.county;
    const republican = registrations.republican;
    const democrat = registrations.democrat;

    var params = {
        TableName: 'county_registrations',
        Item: {
            'state' : state,        
            'county' : county,
            'democrat' : democrat,
            'republican' : republican
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

const reportCountyTotals = async countyTotals => {
    console.log(`county totals: ${JSON.stringify(countyTotals)}`);
    const state = countyTotals.state;
    const county = countyTotals.county;
    const voteCount = countyTotals.voteCount;
    const precinctCount = countyTotals.precinctCount;

    var params = {
        TableName: 'county_registrations',
        Key: {
            'state' : state,
            'county' : county
        },
        UpdateExpression : "SET #vote_count =:vote_count, #precinct_count =:precinct_count",
        ExpressionAttributeNames : {        
        "#vote_count" : "vote_count",
        "#precinct_count" : "precinct_count",
        },
        ExpressionAttributeValues : {            
            ":vote_count" : voteCount,
            ":precinct_count" : precinctCount
        }        
    };

    let response;
        
    return new Promise( (resolve, reject ) =>  docClient.update(params, function(err, data) {
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

const getRegistrations = async state => {
    //get all records for state
    var params = {
        TableName: 'county_registrations',
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

    const registrations = convertRegistrationResponse(result);
    return registrations;
}



module.exports = {
    getRegistrations,
    reportRegistrations,
    reportCountyTotals
};
