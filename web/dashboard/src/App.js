import './App.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import React, { useState } from 'react';
import NationwideTotals from './components/NationwideTotals';
import StateModal from './pages/StateModal';

function calcNationalTotals() {
  return {
    votes: [
      {
        candidateName: 'Hilary Clinton',
        candidateLastName: 'Clinton',
        voteCount: 12235323
      },
      {
        candidateName: 'Donald Trump',
        candidateLastName: 'Trump',
        voteCount: 12343434
      }
    ]
  };
}

function App() {

  const calcNationalTotals = (stateTotals) => {
    let votes = {};
    console.log(stateTotals);
    
    return votes;
}


  const geoUrl = "/geodata/us-albers.json"    
  const [nationalData, setNationalData] = useState(calcNationalTotals());
  const [selectedState, setSelectedState] = useState('FL');

  const onGeographyClick = geography => event => {
    const state= geography.properties.iso_3166_2;
    setSelectedState(state);    
  }

  const handleModalClose = () => {
    setSelectedState(null);
  }

  const setGeoColor = (geography) => {    
    let color = "ffffff";
    const state = geography.properties.iso_3166_2;
    let winner;
    if(nationalData && nationalData[state]) {                
        let winnerVotes;
        const stateVotes = nationalData.states[state];
        for(const candidate in stateVotes) {
            if(!winner) {
              winner = candidate;
              winnerVotes = stateVotes[candidate];
            } else if(stateVotes[candidate] > winnerVotes) {
              winner = candidate;
              winnerVotes = stateVotes[candidate];
            }
        }
    } 

    if(winner == 'clinton') {
      color = '#0000ff';
    } else if(winner == 'trump') {
      color = '#ff0000';
    }
    
    return color;
  }

  const stateReportingCallback = (state, voteData) => {
    if(!voteData) {
      return;
    }
    console.log(voteData);
    let data = nationalData;
    let stateData = {}
    for(const county in voteData.counties) {
        for(const candidateVotes in county.voteData) {
            if(!stateData[candidateVotes.candidate]) {
              stateData[candidateVotes.candidate] = candidateVotes.candidate;
            } else {
              stateData[candidateVotes.candidate] += candidateVotes.candidate;
            }            
        }
    }
    nationalData.states[state] = stateData;
    
    setNationalData(nationalData);
  }

  return (
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
      <Row className="border">
        <Col lg={6} md={9} sm={12}>
            <NationwideTotals totals={nationalData}></NationwideTotals>
        </Col>
      </Row>
      <StateModal showModal={selectedState != null} state={selectedState} onHide={handleModalClose} reportingCallback={stateReportingCallback} />    
    </Container>
  );
}

export default App;
