import './VotingPage.css';
import { Button, Card, Col, Container, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Election } from "../../type";
import { UseSingleElection } from "../../hooks/useElection";
import React, { useContext, useEffect, useState } from 'react';
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import UserContext from '../../context/UserContext';
import { MakeVote } from '../../hooks/useBallots';

export default function VotingPage() {
    const { user } = useContext(UserContext);
    const { electionId } = useParams();
    if (!electionId) {
        throw Error("No Election ID");
    }
    const election: Election | undefined = UseSingleElection(electionId);
    console.log(election);
    const navigate = useNavigate();
    const defaultOptions = election ? election.options : [];
    console.log(defaultOptions);
    const [rankings, setRankings] = useState<string[]>(defaultOptions);
    useEffect(() => {
        if (election && election.options) {
            setRankings(election.options);
        }
    }, [election]);
    console.log(rankings);
    const [show, setShow] = useState(false);

    // Timer
    const [now, setNow] = useState(Date.now());
    const fiveMin = Date.now() + 300000;
    console.log(fiveMin - now);

    // useEffect(() => {
    //     setNow(Date.now);
    //     console.log(fiveMin - now);
    // }, [Date.now()]);

    const moveRankingUp = (index: number) => {
        if (index > 0) {
            const updatedRankings = [...rankings];
            [updatedRankings[index], updatedRankings[index - 1]] = [updatedRankings[index - 1], updatedRankings[index]];
            setRankings(updatedRankings);
        }
    };
    const moveRankingDown = (index: number) => {
        if (index < (rankings.length - 1)) {
            const updatedRankings = [...rankings];
            [updatedRankings[index], updatedRankings[index + 1]] = [updatedRankings[index + 1], updatedRankings[index]];
            setRankings(updatedRankings);
        }
    };

    const handleClose = () => {
        setShow(false);
    };
    const handleFalseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShow(true);
    };
    const handleVoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rankingsReduced: { [key: string]: number } = rankings.reduce<{ [key: string]: number }>((acc, option, index) => {
            acc[option] = index + 1;
            return acc;
        }, {});
        await MakeVote(electionId || '', user?.username || '', rankingsReduced);
        navigate(`/elections/${electionId}`, { replace: true });
    };
    return <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Do You Want To Edit Anything?</Modal.Title>
            </Modal.Header>
            <Modal.Body className='voting-modal-body'>
                {rankings.map((option, index) => {
                    const trueRank = index + 1;
                    return <>
                        <Row>
                            <Col>{trueRank}. {option}</Col>
                        </Row>
                    </>
                })}
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="secondary" onClick={handleClose}>
                    Yes, Close
                </Button>
                <Button variant="success" onClick={handleVoteSubmit}>
                    Nah, Make Vote
                </Button>
            </Modal.Footer>
        </Modal>
        <Container>
            <h1 style={{ textAlign: 'center' }}>{election?.title}</h1>
            <Row className='voting-row-container'>
                <Card className="left-side side" as={Col}>
                    <Card.Title>Options</Card.Title>
                    <Card.Body as={Row} className="row grid-placement">
                        {election?.options.map((option, index) => {
                            const evenOrOdd = index % 2 === 0 ? 'even' : 'odd';
                            return (
                                <Col key={option} className={`option-${evenOrOdd} option col-md-6 col-2`}>
                                    {index + 1}.&nbsp;{option}
                                </Col>
                            );
                        })}
                    </Card.Body>
                </Card>
                <Card className='right-side side' as={Col}>
                    <Card.Title>Rankings</Card.Title>
                    <Card.Body>
                        <Form onSubmit={handleFalseSubmit}>
                            <div className='mb-3 voting-divider'>
                                <ListGroup as={Row} className='voting-rank-list'>
                                    {rankings.map((option, index) => {
                                        const rank = index + 1;
                                        const multipleOf3 = index % 3 !== 0 ? 'notMultipleOf3' : 'multipleOf3';
                                        return <ListGroup.Item className={`col-6 voting-rank-list-item ranking-${multipleOf3}`} as={Col} key={rank}>
                                            <span className='voting-rank-number'>{rank}.</span>
                                            <span className='voting-rank-name'>{option}</span>
                                            <span className='voting-change-span'>
                                                <FaLongArrowAltUp onClick={() => moveRankingUp(index)} className='voting-input-group-text voting-change-button' />
                                                <FaLongArrowAltDown onClick={() => moveRankingDown(index)} className='voting-input-group-text voting-change-button' />
                                            </span>
                                        </ListGroup.Item>
                                    })}
                                </ListGroup>
                            </div>
                            <Button
                                type='submit'
                                variant={rankings.length > 0 ? 'success' : 'danger'}
                            >
                                Submit Rankings
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>

        </Container>
    </>
}
