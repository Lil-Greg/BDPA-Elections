import './ElectionPage.css';
import { useNavigate, useParams } from "react-router-dom";
import { GetBallots, UseSingleElection, GetSingleBallot } from "../../hooks/useElection"
import { Election, GetBallotsResponse, GetSingleBallotType } from "../../type";
import IRVElections from "../../algo/IRV-Elections";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import CPLElections from '../../algo/CPL-Elections';

export default function ElectionPage() {
    const { electionId } = useParams<string>() || '';
    const { user } = useContext(UserContext);
    const election: Election | undefined = UseSingleElection(electionId || '');
    const navigate = useNavigate();
    const [winner, setWinner] = useState<string>('');
    const [ballot, setBallot] = useState<GetSingleBallotType | undefined>();
    const monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        async function fetchData() {
            const ballotCall = await GetSingleBallot(electionId || '', user?.username || '');
            setBallot(ballotCall);
            const optionsResponse: GetBallotsResponse | undefined = await GetBallots(election?.election_id || '');
            const ballotsConverted = optionsResponse?.ballots.map((ballots) => {
                return Object.keys(ballots.ranking);
            }) || [];
            if (election?.type === 'irv') {
                const data = IRVElections(ballotsConverted);
                setWinner(data);
            } else if (election?.type === 'cpl') {
                const { CPL } = CPLElections(ballotsConverted, election.options);
                setWinner(CPL);
            }
        }
        fetchData();
    }, [election])

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
                    {election?.options.map((option) => {
                        return (
                            <>
                                <p className={`every-option option-${user?.type !== 'voter' || ballot?.success === true ? winner === option ? 'winner' : 'regular' : ''}`}>{option}</p>&nbsp;&nbsp;
                            </>
                        )
                    })}
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