import React, { useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import StateGague from '../components/StateGague';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import "bootstrap/dist/css/bootstrap.min.css";
import CountyResults from '../components/CountyResults';

function StateModal(props) {
    
    const baseUrl = "https://ip6rswdf3m.execute-api.us-west-2.amazonaws.com/dev";
    const state = props.state;
    const headers = { Accept: "application/json" };        
    const [data, setData] = useState();
    const [registrationData, setRegistrationData] = useState();
    const [error, setError] = useState();
    const [selectedCounty, setSelectedCounty] = useState();
    const [busy, setBusy] = useState({
        registrationData: false,
        voteData: false
    });
    const url = "/geodata/" + state + ".json"
    let stateTotals;

    function calcStateTotals(results) {

    }

    function calcRegistrationTotals(results) { 
        
    }

    function isBusy() {
        return (busy.registrationData || busy.voteData);
    }

    useEffect(() => {
        setBusy({
            registrationData: true,
            voteData: true
        });
        console.log(`getting votes for ${state}`);
        fetch(`${baseUrl}/votes/state/${state}`, {headers})
            .then(result => result.json())
            .then(result => { setData(result);
                             calcStateTotals(result);
                             props.reportingCallback(state, result);})
            .catch(error => setError(error))
            .finally(setBusy(false));
        
        fetch(`${baseUrl}/registrations/state/${state}`, {headers})
            .then(result => result.json())
            .then(result => { setRegistrationData(result);
                             calcRegistrationTotals(result);
                             props.registrationReportingCallback(state, result);})
            .catch(error => setError(error))
            .finally(setBusy(false));
    }, [state]);
    
    function getCountyColor(geography) {                       
        const countyName = geography.properties.NAME.toUpperCase();
        if(data) {                               
            const county = data.counties[countyName];            
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
        if(data) {
            votes = data.counties[clickedCounty];
        }

        if(registrationData) {                        
            const countyRegistrations = registrationData.filter(county => county.county === clickedCounty);
            if(countyRegistrations && countyRegistrations.length > 0) {
                countyRegistration = countyRegistrations[0];
            }
        }

        setSelectedCounty({
            voteData: votes,
            registrationData: countyRegistration
        });
    }
    

    if(data && !isBusy()) {        
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
    } else if(error) {        
        return (
            <Modal show={props.showModal} size="lg">
                <Modal.Header>Error</Modal.Header>
                <Modal.Body>{error.message}</Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    } else {    
        return (
            <Modal show={props.showModal}>
                <Modal.Header>Loading</Modal.Header>
                <Modal.Body>                    
                    <Spinner>                             
                    </Spinner>                        
                </Modal.Body>                
            </Modal>
        );
    }
}

export default StateModal;