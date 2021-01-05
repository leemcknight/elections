import './App.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import React, { useEffect, useState} from 'react';
import NationwideTotals from './components/NationwideTotals';
import StateModal from './pages/StateModal';
import "bootstrap/dist/css/bootstrap.min.css";
import _, { intersection, isInteger } from 'lodash';

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
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    if(busy.registrationData || busy.voteData) {
      return;
    }
    
    //no longer busy.
    updateStatePercentages(selectedState);
    setShowModal(true);

  }, [busy]);

  const addRegistrationData = (registrationData) => {    
    if(!selectedState) {
      console.log('no selected state.  not adding registration data.');
      return;
    }
    console.log(`adding registration data for state ${selectedState}`);
    let newRegistrationTotals = _.clone(registrationTotals);
    newRegistrationTotals[selectedState] = registrationData;    
    setRegistrationTotals(newRegistrationTotals);
    setSelectedStateRegistrations(registrationData);
  }

  const addVoteData = (voteData) => {    
    if(!selectedState) {
      console.log('no selected state.  not adding registration data.');
      return;
    }
    console.log(`adding vote data for state ${selectedState}`);
    let newVoteTotals = _.clone(voteTotals);    
    if(!newVoteTotals[selectedState]) {
      newVoteTotals[selectedState] = {};
    }

    newVoteTotals[selectedState] = voteData;    
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
    setNationalData(newNationalData);    
    setSelectedStateVotes(voteData);    
  }

  const updateStatePercentages = (state) => {
    if(!state) {
      console.log('state not defined.  not updating state percentages.');
      return;
    } else {
      console.log(`updating state percentages for ${state}`);
    }  

    const stateVoteTotals = voteTotals[state];
    const stateRegistrationTotals = registrationTotals[state];
    console.log(`stateRegistrationTotals: ${JSON.stringify(stateRegistrationTotals)}`);
    console.log(`stateVoteTotals = ${JSON.stringify(stateVoteTotals)}`);

    if(!stateVoteTotals) {
      console.log(`no state vote totals found for ${state}`);
      return;
    }

    if(!stateRegistrationTotals) {
      console.log(`no registration totals found for ${state}`);
      return;
    }
    
    let outstandingVote = 0;
    let actualDem = 0;
    let actualRep = 0;
    let expectedDem = 0;
    let expectedRep = 0;

    for(const registrationData in stateRegistrationTotals) {
        if(Object.keys(stateVoteTotals.counties).includes(registrationData.county)) {
          //have votes for this county.
          let votesIn = 0;
          const candidateVotes = stateVoteTotals.counties[registrationData.county].votes;
          for(const candidateKey in candidateVotes) {
            votesIn += parseInt(candidateVotes[candidateKey]);
            if(candidateKey.toUpperCase() === "CLINTON") {
              actualDem += parseInt(candidateVotes[candidateKey]);
            } else if(candidateKey.toUpperCase() === "TRUMP") {
              actualRep += parseInt(candidateVotes[candidateKey]);
            }
          }
          outstandingVote += parseInt(registrationData.voteCount) - votesIn;
        } else {
          //no votes yet for this county.
          outstandingVote += parseInt(registrationData.voteCount);          
        }        
    }

    const marginOfError = .03;

    console.log(`outstanding votes for ${state}: ${outstandingVote}`);    
    console.log(`actual/expected republican votes: ${actualRep}/${expectedRep}`);
    console.log(`actual/expected democratic votes: ${actualDem}/${expectedDem}`);
  }

  const onGeographyClick = geography => event => {
    const state= geography.properties.iso_3166_2;    
    setSelectedState(state);
  }

  const handleModalClose = () => {
    setShowModal(false);
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
    <StateModal showModal={showModal} 
                state={selectedState} 
                onHide={handleModalClose} 
                stateRegistrations={selectedStateRegistrations}
                stateVotes={selectedStateVotes} />       
    </>
  );
}

export default App;
