import './VotingPage.css';
import { Button, Card, Col, Container, FloatingLabel, Form, InputGroup, ListGroup, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Election } from "../../type";
import { MakeVote, UseSingleElection } from "../../hooks/useElection";
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { IoCloseCircle, IoCloseCircleOutline, IoAddCircle, IoAddCircleOutline } from "react-icons/io5";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import UserContext from '../../context/UserContext';

export default function VotingPage() {
    const { user } = useContext(UserContext);
    const { electionId } = useParams();
    const [switchCloseButton, setSwitchCloseButton] = useState(false);
    const [switchAddButton, setSwitchAddButton] = useState(false);

    const election: Election | undefined = UseSingleElection(electionId || '');
    const navigate = useNavigate();

    const [rankings, setRankings] = useState<string[]>(() => {
        const storedRanks = sessionStorage.getItem('election-rankings');
        return storedRanks ? JSON.parse(storedRanks) : [];
    });
    const [newRank, setNewRank] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputChangeValue, setInputChangeValue] = useState('');

    const [rankingError, setRankingError] = useState(false);
    const rankingErrorMessages = ['Option Already Ranked', 'No Ranking to Add', 'Option Does Not Exist'];
    const [rankingErrorMessage, setRankingErrorMessage] = useState<number | false>(() => {
        return rankingError ? 0 || 1 || 2 : false;
    });
    const [show, setShow] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value === '') {
            setRankingError(true);
            setRankingErrorMessage(1);
        } else {
            setInputChangeValue(event.currentTarget.value)
        }
    }

    useEffect(() => {
        const inputValue = inputRef.current?.value || inputChangeValue;
        if (inputValue === undefined) {
            setRankingError(true);
            setRankingErrorMessage(1);
        } else {
            const checkingOptions = election?.options.filter((x) => inputValue === x);
            const checkingInputValue = rankings.filter((x) => inputValue === x);
            if (checkingInputValue.length !== 0) {
                setRankingError(true);
                setRankingErrorMessage(0);
            } else if (inputValue.trim().length === 0) {
                setRankingError(true);
                setRankingErrorMessage(1);
            } else if (checkingOptions?.length === 0) {
                setRankingError(true);
                setRankingErrorMessage(2);
            } else {
                setNewRank(inputValue);
                setRankingError(false);
                setRankingErrorMessage(false);
            }
        }
    }, [inputRef.current?.value]);

    const addRanking = () => {
        if (rankingError === false) {
            const checkingNewRank = rankings.filter((x) => newRank === x);
            const inputValue = inputRef.current?.value;
            const checkingInputValue = rankings.filter((x) => inputValue === x);

            if (checkingNewRank.length !== 0) {
                setRankingError(true);
                setRankingErrorMessage(0);
            } else if (newRank.trim().length === 0) {
                setRankingError(true);
                setRankingErrorMessage(1);
            } else if (checkingInputValue.length !== 0) {
                setRankingError(true);
                setRankingErrorMessage(0);
            } else {
                setRankings((prevRankings) => [...prevRankings, newRank]);
                setNewRank("");
            }
        }
    };
    const deleteRanking = (index: number) => {
        const updatedRankings = rankings.filter((_, i) => i !== index);
        setRankings(updatedRankings);
    };
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
    useEffect(() => {
        sessionStorage.setItem('election-rankings', JSON.stringify(rankings));
    }, [rankings]);

    const handleCloseHover = () => {
        setSwitchCloseButton(true);
    };
    const handleCloseMouseOut = () => {
        setSwitchCloseButton(false);
    };
    const handleAddHover = () => {
        setSwitchAddButton(true);
    };
    const handleAddMouseOut = () => {
        setSwitchAddButton(false);
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
        navigate(`/elections/${electionId}`, { replace: true });
        await MakeVote(electionId || '', user?.username || '', rankingsReduced);
        sessionStorage.removeItem('election-rankings');
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
                                <InputGroup className='mb-2'>
                                    <InputGroupText
                                        onClick={addRanking}
                                        onMouseOver={handleAddHover}
                                        onMouseOut={handleAddMouseOut}
                                        className={`voting-input-group-text ${rankingError && ' voting-input-group-text-invalid'}`}
                                    >
                                        {switchAddButton ? <IoAddCircle className='plus-icon' /> : <IoAddCircleOutline className='plus-icon' />}
                                    </InputGroupText>
                                    <FloatingLabel
                                        controlId='floatingInputVoting1'
                                        label='Option Ranking'
                                    >
                                        <Form.Control
                                            list='voting-options-list'
                                            placeholder='1st Option'
                                            onChange={handleInputChange}
                                            isInvalid={rankingError}
                                            ref={inputRef}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {rankingError === true && rankingErrorMessage !== false ? rankingErrorMessages[rankingErrorMessage] : 'Nothing Wrong'}
                                        </Form.Control.Feedback>
                                        <datalist id='voting-options-list'>
                                            {election?.options.map((option, index) => <option value={option} key={index}>{option}</option>)}
                                        </datalist>
                                    </FloatingLabel>
                                </InputGroup>
                                <ListGroup as={Row} className='voting-rank-list'>
                                    {rankings.map((option, index) => {
                                        const rank = index + 1;
                                        const multipleOf3 = index % 3 !== 0 ? 'notMultipleOf3' : 'multipleOf3';
                                        return <>
                                            <ListGroup.Item className={`col-6 voting-rank-list-item ranking-${multipleOf3}`} as={Col} key={rank}>
                                                <span className='voting-rank-number'>{rank}.</span>
                                                <span className='voting-rank-name'>{option}</span>
                                                <span className='voting-change-span'>
                                                    <FaLongArrowAltUp onClick={() => moveRankingUp(index)} className='voting-input-group-text voting-change-button' />
                                                    <FaLongArrowAltDown onClick={() => moveRankingDown(index)} className='voting-input-group-text voting-change-button' />
                                                </span>
                                                <span
                                                    onMouseOver={handleCloseHover}
                                                    onMouseOut={handleCloseMouseOut}
                                                    className='voting-input-group-text'
                                                >
                                                    {switchCloseButton === true ?
                                                        <IoCloseCircle
                                                            onClick={() => deleteRanking(index)}
                                                            className='voting-options-delete'
                                                        />
                                                        :
                                                        <IoCloseCircleOutline
                                                            onClick={() => deleteRanking(index)}
                                                            className='voting-options-delete'
                                                        />}
                                                </span>
                                            </ListGroup.Item>
                                        </>
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
