import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DropDown from 'react-bootstrap/Dropdown'
import { useState } from 'react';


function getStates() {
    return {
        
    }
}

function setSelectedState(state) {

}

function gatherVotes(props) {

}

function PrecinctGatherer(props) {
    const states = getStates();
    const counties = getCounties(state);
    const [selectedState, setSelectedState] = useState('FL');
    return (
        <Card>
            <Card.Body>
                <label>State</label>
                <DropDown>
                    {states.map(state => (<DropDown.Item></DropDown.Item>))}
                </DropDown>
                <label>Precincts</label>                
                <DropDown>
                    <DropDown.Item>10</DropDown.Item>
                    <DropDown.Item>20</DropDown.Item>
                    <DropDown.Item>30</DropDown.Item>
                </DropDown>
                <Button>Gather Votes</Button>
            </Card.Body>
        </Card>
    );
}

export default PrecinctGatherer;