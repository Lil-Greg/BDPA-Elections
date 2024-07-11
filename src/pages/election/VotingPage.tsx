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
    const navigate = useNavigate();
    const defaultOptions = election ? election.options : [];
    const [rankings, setRankings] = useState<string[]>(defaultOptions);
    useEffect(() => {
        if (election && election.options) {
            setRankings(election.options);
        }
    }, [election]);
    const [show, setShow] = useState(false);

    // Timer
    const [timeRanOut, setTimeRanOut] = useState(false);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const brother = sessionStorage.getItem("FiveMin");
    if (!brother || brother === null) {
        sessionStorage.setItem("FiveMin", `${Date.now()}`);
    }
    useEffect(() => {
        const fiveMin = parseInt(brother || "0") + 300000;
        const target = new Date(fiveMin);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = target.getTime() - now.getTime();

            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            setMinutes(m);

            const s = Math.floor((difference % (1000 * 60)) / 1000);
            setSeconds(s);

            if (m <= 0 && s <= 0) {
                setTimeRanOut(true);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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

    if (timeRanOut === true) {
        sessionStorage.removeItem("FiveMin");
        setTimeout(() => navigate("/", { replace: true }), 1000);
        ;
    }
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
        sessionStorage.removeItem("FiveMin");
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
                    return <Row key={option}>
                        <Col>{trueRank}. {option}</Col>
                    </Row>
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
            <h1 style={{ textAlign: 'center', textDecoration: "underline" }}>{election?.title}</h1>
            <div className="time" style={{ textAlign: "center" }}>
                <h3>Time</h3>
                <h5 style={timeRanOut ? { fontSize: "2rem", color: "red" } : {}}>{minutes} : {seconds}</h5>
            </div>
            <Row className='voting-row-container'>
                <Card className="left-side side" as={Col}>
                    <Card.Title>Options</Card.Title>
                    <Card.Body as={Row} className="row grid-placement">
                        {election?.options.map((option, index) => {
                            const evenOrOdd = index % 2 === 0 ? 'even' : 'odd';
                            return <Col key={option} className={`option-${evenOrOdd} option col-md-6 col-2`}>
                                {index + 1}.&nbsp;{option}
                            </Col>
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
