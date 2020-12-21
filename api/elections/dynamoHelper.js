

const convertRegistrationResponse = dynamoResponse => {    
    let registrations = [];
    for (const item of dynamoResponse) {        
        registrations.push({
            county: item.county,
            state: item.state,
            republican: item.republican,
            democrat: item.democrat,
            precinctCount: item.precinct_count,
            voteCount: item.vote_count
        });        
    }
    return registrations;
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
    convertStateResponse,
    convertRegistrationResponse
};
