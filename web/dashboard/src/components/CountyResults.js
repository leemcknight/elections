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
            return county.registrationData.county;
        } else {
            return "Click a county to see county vote results";
        }
    }
    
    function renderCountyResults() {
        if(!county) {
            return null;
        }
        const candidateVotes = county.voteData.votes;
        const precinctsReporting = county.voteData.precinctsReporting;
        const totalPrecincts = county.registrationData.precinctCount;
        const precinctPct = (parseInt(precinctsReporting) / parseInt(totalPrecincts) * 100).toFixed(2); 
        return (
            <Container>                
                {                
                    Object.keys(candidateVotes).map(key => (
                        <Row>
                            <Col>{key}</Col>
                            <Col>{candidateVotes[key]}</Col>                            
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