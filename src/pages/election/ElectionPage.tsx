import './ElectionPage.css';
import { useNavigate, useParams } from "react-router-dom";
import { UseSingleElection } from "../../hooks/useElection"
import { Election } from "../../type";
import IRVElections from "../../components/IRV-Elections";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';

export default function ElectionPage() {
    const { electionId } = useParams();
    const { user } = useContext(UserContext);
    const election: Election | undefined = UseSingleElection(electionId || '');
    const navigate = useNavigate();
    const [winner, setWinner] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            const data = await IRVElections(electionId || "");
            setWinner(data);
        }
        fetchData();
    }, [electionId])

    const handleVoteClick = () => {
        if (user?.type === 'voter') {
            navigate(`/elections/${electionId}/${user._id}`)
        }
    }

    return (
        <>
            {winner}
            <Container className="electionPage-container">
                <Card className="electionPage-jumboCard">
                    <h1 className="electionPage-title">{election?.title}</h1>
                    <h5 className="electionPage-description">{election?.description}</h5>
                    <Row>
                        <Col>
                            <p className='electionPage-openingDate electionPage-Dates'>{election?.opensAt && new Date(election.opensAt).toString()}</p>
                        </Col>
                        <Col>
                            <p className='electionPage-closingDate electionPage-Dates'>{election?.closesAt && new Date(election.closesAt).toString()}</p>
                        </Col>
                    </Row>
                </Card>
                <div className='options-overlap-div'>
                    {election?.options.map((options, index) => {
                        return (
                            <>
                                <p className={`every-option option-number-${index}`}>{options}</p>&nbsp;&nbsp;
                            </>
                        )
                    })}
                </div>
                {user?.type === 'voter' && (
                    <Row className='election-vote-btn'>
                        <Button onClick={handleVoteClick}>Want to Vote?</Button>
                    </Row>
                )}
            </Container>
        </>
    )
}