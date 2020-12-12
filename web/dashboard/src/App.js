import './App.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import React, { useState } from 'react';
import NationwideTotals from './components/NationwideTotals';
import StateModal from './pages/StateModal';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  const stateColor = {
    'clinton': "#0000ff",
    'trump': '#ff0000'
  };

  const geoUrl = "/geodata/us-albers.json"    
  const [nationalData, setNationalData] = useState({states: {}});
  const [selectedState, setSelectedState] = useState();

  const onGeographyClick = geography => event => {
    const state= geography.properties.iso_3166_2;
    setSelectedState(state);    
  }

  const handleModalClose = () => {
    setSelectedState(null);
  }

  const setGeoColor = (geography) => {        

    let color = "#505050";
    const state = geography.properties.iso_3166_2;

    if(state === 'FL') {
      console.log('coloring florida');
    }
    
    let winner;
    if(nationalData && nationalData[state]) {                
        let winnerVotes;
        const stateVotes = nationalData.states[state];
        for(const candidate in stateVotes) {
            if(!winner) {
              console.log(`setting winner to ${winner}`);
              winner = candidate;
              winnerVotes = stateVotes[candidate];
            } else if(stateVotes[candidate] > winnerVotes) {
              console.log(`setting winner to ${winner}`);
              winner = candidate;
              winnerVotes = stateVotes[candidate];
            }
        }
    } 

    if(winner === 'clinton') {
      color = '#0000ff';
    } else if(winner === 'trump') {
      color = '#ff0000';
    }
    
    return color;
  }

  const stateReportingCallback = (state, voteData) => {    
    if(!voteData) {
      return;
    }    
    
    let stateData = {}    
    let candidates = [];
    console.log(`iterating through counties for ${state}`);
    const counties = voteData[state].counties;    
    console.log(`there are ${counties.count} counties.`)
    for(const county in counties) {      
      for(const candidateVotes in counties[county].votes) {            
            candidates.push(candidateVotes);
            const numVotes = parseInt(counties[county].votes[candidateVotes]);            
            if(!stateData[candidateVotes]) {
              stateData[candidateVotes] = numVotes;
            } else {
              stateData[candidateVotes] += numVotes;
            }            
        }
    }

    const newNationalData = [...nationalData];
    newNationalData.states[state] = stateData;
    console.log(`setting national data to: ${JSON.stringify(newNationalData)}`);
    setNationalData(newNationalData);
  }

  console.log('rendering...');
  return (
    <>
    <Container>
      <Row>
        <Col>
          <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {                     
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}  
                      fill={setGeoColor(geo)}
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
        <Col lg={6} md={9} sm={12}>
            <NationwideTotals totals={nationalData}></NationwideTotals>
        </Col>
      </Row>
       
    </Container>
    <StateModal showModal={selectedState != null} state={selectedState} onHide={handleModalClose} reportingCallback={stateReportingCallback} />       
    </>
  );
}

export default App;
