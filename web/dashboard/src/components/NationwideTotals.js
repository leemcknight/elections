import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import React, { useState } from 'react';

function calcPercentages(nationData, candidateName) {
    let totalVotes = 0;
    let percentage = 0;
    for (const candidate in nationData) {
        totalVotes += nationData[candidate];
    }

    percentage = nationData[candidateName] / totalVotes;

    return percentage;
}

function NationwideTotals(props) {
    const candidateKeys = Object.entries(props.totals);
    console.log(`candidate Keys: ${candidateKeys}`);
    const totals = props.totals;

    return (        
            <ProgressBar>
                {candidateKeys.map(candidateKey => 
                    (<ProgressBar now={calcPercentages(totals, candidateKey)} 
                                variant="info"
                                key={candidateKey} 
                                label={(calcPercentages(totals, candidateKey) * 100).toString() + '%'}></ProgressBar>)
                )}
            </ProgressBar>
        
    );
}

export default NationwideTotals;