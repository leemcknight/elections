import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import StateGague from '../components/StateGague';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useFetch } from 'react-async';

function StateModal(props) {
    
    const baseUrl = "https://ip6rswdf3m.execute-api.us-west-2.amazonaws.com/dev";
    const state = props.state;
    const headers = { Accept: "application/json" };    
    const reportingCallback = props.reportingCallback;
    
    const {data, error, isPending } = useFetch(`${baseUrl}/votes/state/${state}`, {headers});    
    const url = "/geodata/" + state + ".json"
    
    function getCountyColor(geography) {       
        const countyName = geography.properties.NAME;
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
            return "#00ff00";
        }
    }

    const onGeographyClick = geography => event => {        
        if(data) {
            const votes = data.counties[geography.properties.NAME];
            if(!votes) {
                alert("No precincts reporting.");
            } else {
                alert(JSON.stringify(votes));
            }
        }    
    }
    
    if(data) {
        reportingCallback(state, data);
        return (            
            <Modal show={props.showModal} 
                    onHide={props.onHide} 
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                <Modal.Header>
                    <h3>{props.state}</h3>
                </Modal.Header>
                <Modal.Body>       
                    
                    <Container>
                        <Row>
                            <Col>
                                <ComposableMap projection="geoAlbersUsa">
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
                                </ComposableMap>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <StateGague></StateGague>
                            </Col>
                        </Row>
                        <Row>
                        <Button>Gather Precinct votes</Button>
                        </Row>                    
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    } else if(error) {
        console.log("returning error modal");
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
        console.log("returning spinner modal");
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