import './App.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import React, { useEffect, useState} from 'react';
import NationwideTotals from './components/NationwideTotals';
import StateModal from './pages/StateModal';
import "bootstrap/dist/css/bootstrap.min.css";
import _ from 'lodash';

function App() {

  const stateColor = {
    'clinton': "#0000ff",
    'trump': '#ff0000'
  };

  const baseUrl = "https://ip6rswdf3m.execute-api.us-west-2.amazonaws.com/dev";
  const headers = { Accept: "application/json" };        
  const geoUrl = "/geodata/us-albers.json"    
  const [nationalData, setNationalData] = useState({states: {}});
  const [selectedState, setSelectedState] = useState();  
  const [voteTotals, setVoteTotals] = useState({});
  const [registrationTotals, setRegistrationTotals] = useState({});
  const [selectedStateVotes, setSelectedStateVotes] = useState({});
  const [selectedStateRegistrations, setSelectedStateRegistrations] = useState({});
  const [error, setError] = useState();
  const [busy, setBusy] = useState({
    registrationData: false,
    voteData: false
  });

  useEffect(() => {
    setBusy({
        registrationData: true,
        voteData: true
    });
    console.log(`getting votes for ${selectedState}`);
    fetch(`${baseUrl}/votes/state/${selectedState}`, {headers})
        .then(result => result.json())
        .then(result => { addVoteData(result); })
        .catch(error => setError(error))
        .finally(setBusy({
          registrationData: busy.registrationData,
          voteData: false
        }));
    
    fetch(`${baseUrl}/registrations/state/${selectedState}`, {headers})
        .then(result => result.json())
        .then(result => { addRegistrationData(result);})
        .catch(error => setError(error))
        .finally(setBusy({
          registrationData: false,
          voteData: busy.voteData
        }));
  }, [selectedState]);

  const addRegistrationData = (registrationData) => {    
    let newRegistrationTotals = _.clone(registrationTotals);
    newRegistrationTotals[selectedState] = registrationData;
    console.log('setting registration totals');
    setRegistrationTotals(newRegistrationTotals);
    console.log('setting selected registration totals');
    setSelectedStateRegistrations(registrationData);
    updateStatePercentages(selectedState);
  }

  const addVoteData = (voteData) => {   
    console.log('addVoteData');
    let newVoteTotals = _.clone(voteTotals);            
    console.log(`cloned voteTotals: ${JSON.stringify(newVoteTotals)}`);
    if(!newVoteTotals[selectedState]) {
      newVoteTotals[selectedState] = {};
    }

    newVoteTotals[selectedState] = voteData;
    console.log(`setting vote totals to: ${JSON.stringify(voteData)}`);
    setVoteTotals(newVoteTotals);

    //update national totals
    let stateData = {}; 
    let candidates = [];    
    const counties = voteData.counties;    
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
    const newNationalData = _.clone(nationalData);    
    newNationalData.states[selectedState] = stateData;
    console.log('setting national data')    ;
    setNationalData(newNationalData);
    
    console.log(`setting selectedStateVotes to: ${JSON.stringify(voteData)}`);
    setSelectedStateVotes(voteData);     
    updateStatePercentages(selectedState);
  }

  const updateStatePercentages = (state) => {    
     const stateVoteTotals = voteTotals[state];
     const stateRegistrationTotals = registrationTotals[state];
     console.log(`vote totals for ${state}: ${JSON.stringify(stateVoteTotals)}`);
     console.log(`registration totals for ${state}: ${JSON.stringify(stateRegistrationTotals)}`);
  }

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
    
    let winner;
    if(nationalData && nationalData.states[state]) {                
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

    if(stateColor[winner]) {
      color = stateColor[winner];    
    }
    return color;
  }
  
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
    <StateModal showModal={selectedState != null} 
                state={selectedState} 
                onHide={handleModalClose} 
                stateRegistrations={selectedStateRegistrations}
                stateVotes={selectedStateVotes} />       
    </>
  );
}

export default App;
