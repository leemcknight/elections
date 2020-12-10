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
    const text = buildGagueText(props);
    const style = {
        height: 250,
        width: 250
    }
    return (    
        <Card>
            <Card.Header className="bg">{props.state}</Card.Header>
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <GagueChart id={props.state} percent={text.candidateTwoPercentage} style={style}></GagueChart>            
                
            </Card.Body>
        </Card>        
    );
}

export default StateGague;