

function convertDynamoResponse(dynamoResponse) {    
    let parks = [];
    for (const item of dynamoResponse.Items) {        
        let league;
        let end;
        if (item.league != undefined) {
            league = item.league.S;
        }
        if (item.end != undefined) {
            end = item.end.S;
        }
        parks.push({
            city: item.city.S,
            ballpark_id: item.ballpark_id.S,
            end: end,
            name: item.name.S,
            league: league,
            start: item.start.S,
            state: item.state.S
        });        
    }
    return parks;
}

const convertStateResponse = dynamoResult => {
    let counties = {};
    console.log(`dynamo result: ${JSON.stringify(dynamoResult)}`);
    for(const item of dynamoResult) {        
        const county = item.county;        
        const voteData = JSON.parse(item.voteData);

        for(const key in voteData) {
            if(key == 'name' || key == 'county') {
                delete voteData[key];
            }
        }

        if(!counties[county]) {
            counties[county] = {
                precinctsReporting: 1,
                votes: voteData
            }
        } else {
            let existingCounty = counties[county];
            existingCounty.precinctsReporting++;
            for(key of voteData) {
                //keys are candidate last names
                existingCounty[key] += voteData[key];
            }
        }
    }

    return counties;
};


module.exports = {
    convertStateResponse
};