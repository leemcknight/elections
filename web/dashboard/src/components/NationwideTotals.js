import ProgressBar from 'react-bootstrap/ProgressBar';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import _ from 'lodash';

const candidateColorKeys = {
    'clinton': 'primary',
    'trump': 'danger'
}

function calcPercentages(nationData) {    
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
    let percentages = {};
    for(const candidate in votes) {
        const candidatePercentage = votes[candidate] /  totalVotes;
        percentages[candidate] = (candidatePercentage * 100).toFixed(2);
    }

    return [percentages,        
            votes];
}

function NationwideTotals(props) {
    let [percentages, votes] = calcPercentages(props.totals);
    console.log(`percentages = ${JSON.stringify(percentages)}`);
    
    return (        
        <Container>
            <Row>
                <Col>
                    <ProgressBar>
                        {Object.keys(percentages).map(candidateKey => 
                            (<ProgressBar now={percentages[candidateKey]} 
                                        variant={candidateColorKeys[candidateKey]}
                                        key={candidateKey} 
                                        label={(percentages[candidateKey]).toString() + '%'}></ProgressBar>)
                        )}
                    </ProgressBar>
                </Col>
            </Row>
            <Row className="border">
                {Object.keys(votes).map(candidateKey => (
                        <>
                        <Col className="border" lg={6}><label>{candidateKey}</label></Col>
                        <Col className="border" lg={6}><label>{votes[candidateKey]}({percentages[candidateKey].toString() + '%'})</label></Col>                        
                        </>))}
                
            </Row>
        </Container>
        
    );
}

export default NationwideTotals;