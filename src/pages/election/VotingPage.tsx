import './VotingPage.css';
import { Button, Card, Col, Container, FloatingLabel, Form, FormControl, InputGroup, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Election } from "../../type";
import { UseSingleElection } from "../../hooks/useElection";
import React, { useState } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { IoCloseCircle, IoCloseCircleOutline } from "react-icons/io5";

export default function VotingPage() {
    const { userId } = useParams();
    const { electionId } = useParams();
    const [switchCloseButton, setSwitchCloseButton] = useState(false);

    const election: Election | undefined = UseSingleElection(electionId || '');

    const tableSize = [0];
    const handleAddOnClick = () => {
        const length = tableSize.length;
        tableSize.push(length)
        console.log(tableSize);
        console.log(length);
    }
    const handleVoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }
    const handleCloseHover = () => {
        setSwitchCloseButton(true);
    }
    const handleCloseMouseOut = () => {
        setSwitchCloseButton(false);
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
                    <Card.Body className="row grid-placement">
                        {election?.options.map((option, index) => {
                            const evenOrOdd = index % 2 === 0 ? 'even' : 'odd';
                            return (
                                <div key={option} className={`option-${evenOrOdd} option col-md-6`}>
                                    {index}.&nbsp;{option}
                                </div>
                            )
                        })}
                    </Card.Body>
                </Card>
                <Card className='right-side side' as={Col}>
                    <Card.Title>Rankings</Card.Title>
                    <Card.Body>
                        <Form onSubmit={handleVoteSubmit}>
                            <Table striped bordered size='sm'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Option</th>
                                        <th>Add New Row</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableSize && tableSize.map((size, index) => {
                                        const actualSize = size + 1;
                                        return (
                                            <tr key={index}>
                                                <td>{actualSize}</td>
                                                <td>
                                                    <InputGroup>
                                                        <FloatingLabel
                                                            controlId='floatingInputVoting1'
                                                            label={actualSize === 1 ? (`${actualSize}st Option`) : actualSize === 2 ? (`${actualSize}nd Option`) :
                                                                actualSize === 3 ? (`${actualSize}rd Option`) : (
                                                                    (`${actualSize}th Option`)
                                                                )}>
                                                            <FormControl list='voting-options-list' placeholder='1st Option' />
                                                            <datalist id='voting-options-list'>
                                                                {election?.options.map((option, index) => <option value={option} key={index}>{option}</option>)}
                                                            </datalist>
                                                        </FloatingLabel>
                                                        <InputGroupText onMouseOver={handleCloseHover} onMouseOut={handleCloseMouseOut}>
                                                            {switchCloseButton === true ? <IoCloseCircle /> : <IoCloseCircleOutline />}
                                                        </InputGroupText>
                                                    </InputGroup>
                                                </td>
                                                <td>
                                                    <Button>
                                                        <IoAddCircleOutline className='plus-icon' onClick={handleAddOnClick} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    <td>
                                    </td>
                                </tbody>
                            </Table>
                            <Button type='submit'>Submit Rankings</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>

        </Container>
    </>
}