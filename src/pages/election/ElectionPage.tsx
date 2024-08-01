import './ElectionPage.css';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
import DistributeCalls from './DistributeCalls';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

/* Display Election information and allows Users to Vote */

export default function ElectionPage() {
    const { electionId } = useParams<string>();
    const { user } = useContext(UserContext);

    const allUsersName = useQuery(api.users.get);
    if (!electionId) {
        throw Error('Missing election_id param');
    }
    const navigate = useNavigate();
    if (!user) {
        return;
    }
    const { data, isLoading, isError, error } = useTanstackQuery({
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
    const voterNames = ballotsResponse.ballots.map(ballot => ballot.voter_id);
    const filteredUsernames = allUsersName?.filter(value => voterNames.includes(value.username));
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
                {election.options.map(option => <p key={option} className={`me-2 every-option option-${winner === option ? 'winner' : 'regular'}`}>{option}</p>)}
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
                {user.type !== "voter" && user.type !== "reporter" && (
                    <div className="row">
                        <h3 className='h3 col-12 mb-3' style={{ textDecoration: "underline" }}>Ballots</h3>
                        {ballotsResponse.success === true && filteredUsernames ? (
                            ballots.map((ballot, index) => <div key={index} className='col-4 d-flex justify-content-center'>
                                <p><span className='h6' style={{ textDecoration: "underline" }}>{filteredUsernames[index].firstName}&nbsp;{filteredUsernames[index].lastName}</span>: {ballot.map(option => <span
                                    key={option}>{option}, </span>)}</p>
                            </div>)
                        ) : (
                            <p>No Ballots</p>
                        )}
                    </div>
                )}
            </Row>
        </Container>
    )
}