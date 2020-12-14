import ProgressBar from 'react-bootstrap/ProgressBar';
import React, { useState } from 'react';

const candidateColorKeys = {
    'clinton': 'primary',
    'trump': 'danger'
}

function calcPercentages(nationData) {
    console.log(`nationData: ${JSON.stringify(nationData)}`);
    let votes = {};    
    let totalVotes = 0;
    for(const state in nationData.states) {        
        const stateData = nationData.states[state];        
        for (const candidate in stateData) {            
            let currentVotes = 0;
            if(votes[candidate]) {
                currentVotes = votes[candidate];
            }
            
            totalVotes += parseInt(stateData[candidate]);
            votes[candidate] = currentVotes + parseInt(stateData[candidate]);
        }
    }
    console.log(`total votes: ${totalVotes}`);
    console.log(`nationwide: ${JSON.stringify(votes)}`);
    let percentages = {};
    for(const candidate in votes) {
        const candidatePercentage = votes[candidate] /  totalVotes;
        percentages[candidate] = candidatePercentage * 100;
    }
    
    return percentages;
}

function NationwideTotals(props) {
    const percentages = calcPercentages(props.totals);
    console.log(`percentages = ${JSON.stringify(percentages)}`);
    
    return (        
            <ProgressBar>
                {Object.keys(percentages).map(candidateKey => 
                    (<ProgressBar now={percentages[candidateKey]} 
                                variant={candidateColorKeys[candidateKey]}
                                key={candidateKey} 
                                label={(percentages[candidateKey]).toString() + '%'}></ProgressBar>)
                )}
            </ProgressBar>
        
    );
}

export default NationwideTotals;