import GagueChart from 'react-gauge-chart';
import Card from 'react-bootstrap/Card';

function buildGagueText(props) {
    return {
        candidateOneName: 'Clinton',
        candidateOnePercentage: .344,
        candidateOneVotes: 340000,
        candidateTwoName: 'Trump',
        candidateTwoPercentage: .656,
        candidateTwoVotes: 656000,
        gagueText: 'Likely Trump'
    };
}

function StateGague(props) {

    const calcProbabilities = (registrationData, voteData) => {
        let totalRegistrations = 0;
        for(const registration of registrationData) {
            totalRegistrations += registration.republican;
            totalRegistrations += registration.democrat;
        }
    }

    const text = buildGagueText(props);
    const style = {
        height: 250,
        width: 250
    }
    return (    
        <Card>            
            <Card.Body>
                <Card.Title>Win Probability</Card.Title>
                <GagueChart id={props.state} percent={text.candidateTwoPercentage} style={style}></GagueChart>                            
            </Card.Body>
        </Card>        
    );
}

export default StateGague;