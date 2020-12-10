import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import React, { useState } from 'react';

function calcPercentages(nationData) {
    let totalVotes = 0;
    let percentageData = [];
    let candidateVotes;
    for(candidateVotes of nationData.votes) {
        totalVotes += candidateVotes.voteCount;
    }

    for(candidateVotes of nationData.votes) {
        percentageData.push(
            {
                percent: candidateVotes.voteCount / totalVotes,
                candidateName: candidateVotes.candidateName                
            }
        )        
    }

    return percentageData;
}

function NationwideTotals(props) {
    const percentages = calcPercentages(props.totals);
    return (
        
            <ProgressBar>
                {percentages.map(percentage => 
                    (<ProgressBar now={percentage.percent} 
                                variant="info"
                                key={percentage.candidateName} 
                                label={percentage.percent.toString() + '%'}></ProgressBar>)
                )}
            </ProgressBar>
        
    );
}

export default NationwideTotals;