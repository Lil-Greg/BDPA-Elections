import './VotingPage.css';
import { Button, Card, Col, Container, FloatingLabel, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Election } from "../../type";
import { UseSingleElection } from "../../hooks/useElection";
import React, { useEffect, useState } from 'react';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { IoCloseCircle, IoCloseCircleOutline, IoAddCircle, IoAddCircleOutline } from "react-icons/io5";

export default function VotingPage() {
    const { userId } = useParams();
    const { electionId } = useParams();
    const [switchCloseButton, setSwitchCloseButton] = useState(false);
    const [switchAddButton, setSwitchAddButton] = useState(false);

    const election: Election | undefined = UseSingleElection(electionId || '');

    const [rankings, setRankings] = useState<string[]>(() => {
        const storedRanks = localStorage.getItem('election-rankings');
        return storedRanks ? JSON.parse(storedRanks) : [];
    });
    const [newRank, setNewRank] = useState<string>("");

    const [rankingError, setRankingError] = useState(false);
    const rankingErrorMessages = ['Option Already Ranked', 'No Ranking to Add', 'Option Does Not Exist'];
    const [rankingErrorMessage, setRankingErrorMessage] = useState<number | false>(() => {
        return rankingError ? 0 || 1 || 2 : false;
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewRank(event.target.value);
        const checkingNewRank = rankings.filter((x) => newRank === x);
        if (newRank.trim() === '') {
            setRankingError(true);
            setRankingErrorMessage(1);
        } else if (checkingNewRank !== undefined) {
            setRankingError(true);
            setRankingErrorMessage(0);
        } else {
            setRankingError(false);
            setRankingErrorMessage(false);
        }
    }
    const addRanking = () => {
        if (rankingError === false) {
            console.log("New Rank Added", newRank);
            setRankings((prevRankings) => [...prevRankings, newRank]);
            setNewRank("");
        }
    }
    const deleteRanking = (index: number) => {
        const updatedRankings = rankings.filter((_, i) => i !== index);
        setRankings(updatedRankings);
    }
    const moveRankingUp = (index: number) => {
        if (index > 0) {
            const updatedRankings = [...rankings];
            [updatedRankings[index], updatedRankings[index - 1]] = [updatedRankings[index - 1], updatedRankings[index]];
            setRankings(updatedRankings);
        }
    }
    const moveRankingDown = (index: number) => {
        if (index < (rankings.length - 1)) {
            const updatedRankings = [...rankings];
            [updatedRankings[index], updatedRankings[index + 1]] = [updatedRankings[index + 1], updatedRankings[index]];
            setRankings(updatedRankings);
        }
    }
    useEffect(() => {
        localStorage.setItem('election-rankings', JSON.stringify(rankings));
    }, [rankings]);

    const handleCloseHover = () => {
        setSwitchCloseButton(true);
    }
    const handleCloseMouseOut = () => {
        setSwitchCloseButton(false);
    }
    const handleAddHover = () => {
        setSwitchAddButton(true);
    }
    const handleAddMouseOut = () => {
        setSwitchAddButton(false);
    }
    const handleVoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }
    return <>
        <Container>
            User's Id: {userId}
            <br />
            Election Id: {electionId}
            <br />
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
                        <Form onSubmit={handleVoteSubmit}>
                            <div className='mb-3 voting-divider'>
                                <InputGroup className='mb-2'>
                                    <InputGroupText
                                        onClick={addRanking}
                                        onMouseOver={handleAddHover}
                                        onMouseOut={handleAddMouseOut}
                                        className={rankingError ? 'voting-input-group-text voting-input-group-text-invalid' : 'voting-input-group-text'}
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
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {rankingErrorMessage && rankingErrorMessages[rankingErrorMessage]}
                                        </Form.Control.Feedback>
                                        <datalist id='voting-options-list'>
                                            {election?.options.map((option, index) => <option value={option} key={index}>{option}</option>)}
                                        </datalist>
                                    </FloatingLabel>
                                </InputGroup>
                                <ListGroup as={Row}>
                                    {rankings.map((option, index) => {
                                        const rank = index + 1;
                                        return <>
                                            <ListGroup.Item className='col-6' as={Col} key={rank}>
                                                {rank}.&nbsp;{option}
                                                <span onMouseOver={handleCloseHover} onMouseOut={handleCloseMouseOut} key={rank} className='voting-input-group-text'>
                                                    {switchCloseButton === true ? <IoCloseCircle onClick={() => deleteRanking} className='voting-options-delete' /> : <IoCloseCircleOutline onClick={() => deleteRanking} className='voting-options-delete' />}
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
/*
    {tableSize && tableSize.map((size, index) => {
                                        const actualSize = index + 1;
                                        return (
                                            <tr key={index}>
                                                <td>{actualSize}</td>
                                                <td>
                                                </td>
                                            </tr>
                                        )
                                    })}
*/