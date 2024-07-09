import './ElectionPage.css';
import { useNavigate, useParams } from "react-router-dom";
import { UseSingleElection } from "../../hooks/useElection"
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import DistributeCalls from './DistributeCalls';

// TO-DO: Fix the render issue - may be the useQueries from the multiple fetches.

export default function ElectionPage() {
    const { electionId } = useParams<string>();
    const { user } = useContext(UserContext);
    if (!electionId) {
        throw Error('Missing election_id param');
    }
    const election = UseSingleElection(electionId);
    const navigate = useNavigate();
    if (!election || !user) {
        return null;
    }
    const { winner, ballot } = DistributeCalls(election, user);

    const monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // if (isLoading) {
    //     return <>
    //         Loading...
    //     </>
    // };
    // if (isErroring) {
    //     return <>
    //         Something Went Wrong!
    //     </>
    // }
    // useEffect(() => {
    //     async function fetchData() {
    //         if (!election || !user) {
    //             return;
    //         }
    //         setBallot(ballotCall);
    //         const optionsResponse: GetBallotsResponse | undefined = GetBallots(election.election_id);
    //         const ballotsConverted = optionsResponse?.ballots.map((ballots) => {
    //             return Object.keys(ballots.ranking);
    //         }) || [];
    //         if (election?.type === 'irv') {
    //             const data = IRVElections(ballotsConverted);
    //             setWinner(data);
    //         } else if (election?.type === 'cpl') {
    //             const { CPL } = CPLElections(ballotsConverted, election.options);
    //             setWinner(CPL);
    //         }
    //     }
    //     fetchData();
    // }, [election]);

    const handleVoteClick = async () => {
        if (user?.type === 'voter') {
            navigate(`/elections/${electionId}/${user._id}`)
        }
    }

    return (
        <>
            <Container className="electionPage-container">
                <Card className="electionPage-jumboCard">
                    <h1 className="electionPage-title">{election?.title}</h1>
                    <h5 className="electionPage-description">{election?.description}</h5>
                    <Row>
                        <Col>
                            <p className='electionPage-openingDate electionPage-Dates'>
                                {election && monthNames[(new Date(election.opensAt).getUTCMonth())]}&nbsp;
                                {election && new Date(election.opensAt).getDay().toString()},&nbsp;
                                {election && new Date(election.opensAt).getFullYear().toString()}
                            </p>
                        </Col>
                        <Col>
                            <p className='electionPage-closingDate electionPage-Dates'>
                                {election && monthNames[(new Date(election.opensAt).getUTCMonth())]}&nbsp;
                                {election && new Date(election.opensAt).getDay().toString()},&nbsp;
                                {election && new Date(election.opensAt).getFullYear().toString()}
                            </p>
                        </Col>
                    </Row>
                </Card>
                <div className='options-overlap-div'>
                    {election?.options.map(option => <p key={option} className={`me-2 every-option option-${user?.type !== 'voter' || ballot?.success === true ? winner === option ? 'winner' : 'regular' : ''}`}>{option}</p>)}
                </div>
                <Row className='election-vote-btn'>
                    {user?.type === 'voter' && ballot?.success === true ? (
                        <Button variant='danger'>
                            Already Voted, Want to Go Back?
                        </Button>
                    ) : user?.type === 'voter' && (
                        <Button onClick={handleVoteClick} variant='success'>Want to Vote?</Button>
                    )}
                </Row>
            </Container>
        </>
    )
}
/*
import './ElectionPage.css';
import { useNavigate, useParams } from "react-router-dom";
import { UseSingleElection } from "../../hooks/useElection"
import { GetBallotsResponse, GetSingleBallotType } from "../../type";
import IRVElections from "../../algo/IRV-Elections";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import CPLElections from '../../algo/CPL-Elections';
import { GetBallots, GetSingleBallot } from '../../hooks/useBallots';

export default function ElectionPage() {
    const { electionId } = useParams<string>();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [winner, setWinner] = useState<string>('');
    const [ballot, setBallot] = useState<GetSingleBallotType | undefined>();

    if (!electionId) {
        throw Error('Missing election_id');
    }

    const election = UseSingleElection(electionId);
    const ballotCall = GetSingleBallot(electionId, user?.username);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        async function fetchData() {
            if (!election || !user) {
                return;
            }
            setBallot(ballotCall);
            const optionsResponse: GetBallotsResponse | undefined = GetBallots(election.election_id);
            const ballotsConverted = optionsResponse?.ballots.map((ballots) => {
                return Object.keys(ballots.ranking);
            }) || [];
            if (election.type === 'irv') {
                const data = IRVElections(ballotsConverted);
                setWinner(data);
            } else if (election.type === 'cpl') {
                const { CPL } = CPLElections(ballotsConverted, election.options);
                setWinner(CPL);
            }
        }
        fetchData();
    }, [election, user, ballotCall]);

    if (!election || !user) {
        return null;
    }

    const handleVoteClick = async () => {
        if (user.type === 'voter') {
            navigate(`/elections/${electionId}/${user._id}`);
        }
    };

    return (
        <Container className="electionPage-container">
            <Card className="electionPage-jumboCard">
                <h1 className="electionPage-title">{election.title}</h1>
                <h5 className="electionPage-description">{election.description}</h5>
                <Row>
                    <Col>
                        <p className='electionPage-openingDate electionPage-Dates'>
                            {monthNames[(new Date(election.opensAt).getUTCMonth())]}&nbsp;
                            {new Date(election.opensAt).getDay().toString()},&nbsp;
                            {new Date(election.opensAt).getFullYear().toString()}
                        </p>
                    </Col>
                    <Col>
                        <p className='electionPage-closingDate electionPage-Dates'>
                            {monthNames[(new Date(election.opensAt).getUTCMonth())]}&nbsp;
                            {new Date(election.opensAt).getDay().toString()},&nbsp;
                            {new Date(election.opensAt).getFullYear().toString()}
                        </p>
                    </Col>
                </Row>
            </Card>
            <div className='options-overlap-div'>
                {election.options.map(option => (
                    <p key={option} className={`me-2 every-option option-${user.type !== 'voter' || ballot?.success === true ? winner === option ? 'winner' : 'regular' : ''}`}>{option}</p>
                ))}
            </div>
            <Row className='election-vote-btn'>
                {user.type === 'voter' && ballot?.success === true ? (
                    <Button variant='danger'>
                        Already Voted, Want to Go Back?
                    </Button>
                ) : user.type === 'voter' && (
                    <Button onClick={handleVoteClick} variant='success'>Want to Vote?</Button>
                )}
            </Row>
        </Container>
    );
}

*/