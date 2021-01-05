import React  from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const candidateColorKeys = {
    'clinton': 'primary',
    'trump': 'danger'
}

function CountyResults(props) {

    const county = props.county; 

    function renderCountyTitle() {
        if(county) {
            if(county.registrationData) {
                return county.registrationData.county;
            } else {
                return "No data available for this county.";
            }
        } else {
            return "Click a county to see county vote results";
        }
    }
    
    function renderCountyResults() {
        if(!county) {
            return null;
        }
        let candidateVotes = {};
        let precinctsReporting = 0;
        
        if(county.voteData) {
            candidateVotes = county.voteData.votes;
            precinctsReporting = county.voteData.precinctsReporting;
        }

        let totalVotes = 0;
        for(const voteKey in candidateVotes) {
            totalVotes += parseInt(candidateVotes[voteKey]);
        }

        let totalPrecincts = 0;
        let precinctPct = 0;
        if(county.registrationData) {
            totalPrecincts = county.registrationData.precinctCount;
            precinctPct = (parseInt(precinctsReporting) / parseInt(totalPrecincts) * 100).toFixed(2); 
        }

        return (
            <Container>                
                {                
                    Object.keys(candidateVotes).map(key => (
                        <Row>
                            <Col>{key}</Col>
                            <Col>{candidateVotes[key]}</Col>
                            <Col>{((parseInt(candidateVotes[key]) / totalVotes) * 100).toFixed(2)}%</Col>
                        </Row>))
                }                
                <Row>
                    <Col>{precinctPct}% precincts reporting</Col>
                </Row>
            </Container>
        );
    }
    
    return (     
        <Card>
            <Card.Body>
                <Card.Title>
                    {
                        renderCountyTitle()
                    }
                    </Card.Title>
                
                    {
                        renderCountyResults()
                    }
                
            </Card.Body>
        </Card>        
    );
}

export default CountyResults;