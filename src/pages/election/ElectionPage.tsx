import './ElectionPage.css';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
import DistributeCalls from './DistributeCalls';
import { useQuery } from '@tanstack/react-query';

// TO-DO: Fix the render issue - may be the useQueries from the multiple fetches.

export default function ElectionPage() {
    const { electionId } = useParams<string>();
    const { user } = useContext(UserContext);
    if (!electionId) {
        throw Error('Missing election_id param');
    }
    const navigate = useNavigate();
    if (!user) {
        return;
    }
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["CombinedSingleElection"],
        queryFn: () => DistributeCalls(electionId, user),
    });

    const monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (isLoading) {
        return <>
            Loading...
        </>
    };
    if (isError) {
        return <>
            Something Went Wrong!
            <br />
            {JSON.stringify(error)}
        </>
    };
    if (!data) {
        throw Error("Single Election Use Query Data Errored");
    };
    const { election, winner, userVote, ballotsResponse, ballots } = data;

    const handleVoteClick = async () => {
        if (user?.type === 'voter') {
            navigate(`/elections/${electionId}/vote`);
        }
    };
    return (
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
                {election.options.map(option => <p key={option} className={`me-2 every-option option-${user?.type !== 'voter' || userVote?.success === true ? winner === option ? 'winner' : 'regular' : ''}`}>{option}</p>)}
            </div>
            <Row className='election-vote-btn'>
                {user.type === 'voter' && userVote.success === true ? (
                    <Button
                        variant='primary'
                        onClick={() => { navigate(`/elections/${electionId}/vote`) }}
                    >
                        Already Voted, Want to Vote Again?
                    </Button>
                ) : user.type === 'voter' && (
                    <Button onClick={handleVoteClick} variant='success'>Want to Vote?</Button>
                )}
                <div className="row">
                    <h3 className='h3 col-12 mb-3' style={{ textDecoration: "underline" }}>Ballots</h3>
                    {user.type !== "voter" && user.type !== "reporter" && ballotsResponse.success === true ? (
                        ballots.map((ballot, index) => <div key={index} className='col-4 d-flex justify-content-center'>
                            <p>{index % 2 === 0 ? "*****"
                                : index % 3 === 0 ? "*******"
                                    : index % 5 === 0 ? "***"
                                        : "*********"}: {ballot.map(option => <span
                                            key={option}>{option}, </span>)}</p>
                        </div>)
                    ) : (
                        <p>No Ballots</p>
                    )}
                </div>
            </Row>
        </Container>
    )
}