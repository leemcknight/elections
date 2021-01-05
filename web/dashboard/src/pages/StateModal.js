import React, { useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import StateGague from '../components/StateGague';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import "bootstrap/dist/css/bootstrap.min.css";
import CountyResults from '../components/CountyResults';

function StateModal(props) {    
    const state = props.state;
    const stateVotes = props.stateVotes;
    const stateRegistrations = props.stateRegistrations;
    const [selectedCounty, setSelectedCounty] = useState();
    const url = "/geodata/" + state + ".json"

    function getCountyColor(geography) {                       
        const countyName = geography.properties.NAME.toUpperCase();
        
        if(stateVotes) {          
            if(!stateVotes.counties) {
                console.log(`counties is undefined in ${JSON.stringify(stateVotes)}`);
                return;
            }                     
            const county = stateVotes.counties[countyName];            
            if(!county) {            
                return "#454545";
            }            
            const votes = county.votes;
            if(votes.trump > votes.clinton) {
                return "#ff0000";
            } else if(county.trump < county.clinton) {
                return "#0000ff";
            } else {
                return "#cecece";
            }
        } else {
            return "#0000ff";
        }
    }

    const onGeographyClick = geography => event => {        
        const clickedCounty = geography.properties.NAME.toUpperCase();
        let votes, countyRegistration;
        if(stateVotes) {            
            votes = stateVotes.counties[clickedCounty];
        }

        if(stateRegistrations) {
            const countyRegistrations = stateRegistrations.filter(county => county.county === clickedCounty);            
            if(countyRegistrations && countyRegistrations.length > 0) {
                countyRegistration = countyRegistrations[0];
            }
        } 

        setSelectedCounty({
            voteData: votes,
            registrationData: countyRegistration
        });
    }
        
    return (            
        <Modal show={props.showModal} 
                onHide={props.onHide}                    
                >
            <Modal.Header closeButton>
                <h3>{props.state}</h3>
            </Modal.Header>
            <Modal.Body>                           
                <Container>
                    <Row>
                        <Col>
                            <ComposableMap projection="geoAlbers">
                                <ZoomableGroup>
                                <Geographies geography={url}>
                                    {({ geographies }) =>
                                    geographies.map(geo => {                                     
                                        return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}  
                                            fill={getCountyColor(geo)}
                                            onClick={onGeographyClick(geo)}
                                        />
                                        );
                                    })
                                    }
                                </Geographies>
                                </ZoomableGroup>
                            </ComposableMap>
                        </Col>
                    </Row>                        
                    <Row>
                        <Col>
                            <CountyResults county={selectedCounty} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <StateGague></StateGague>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default StateModal;