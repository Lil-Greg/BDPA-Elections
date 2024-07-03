import './MultiElectionsPage.css';
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import getImageURL from '../../utils/image-util';
import { useContext, useState } from 'react';
import UserContext from '../../context/UserContext';
import UseElection from '../../hooks/useElection';

export default function MultiElectionsPage() {
    const [after, setAfter] = useState(10);

    const handleNext = () => {
        setAfter(after + 10);
    };
    const handlePrev = () => {
        setAfter(after > 10 ? after - 10 : Infinity); // Random Code
    };

    const { elections, isLoading, isErroring, electionsError } = UseElection();
    console.log("Checking Elections variable for undefined", elections);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    if (isLoading) {
        return <>
            <div className="loadingText">Loading...</div>
        </>
    };
    if (isErroring) {
        return <>
            <div className="errorCard">
                <div className="errorMessage">
                    <img src={getImageURL('errorMagnifier.svg')} alt="Error Magnifier" />
                    <h1>Something went wrong!</h1>
                    <hr />
                    <code>
                        Error Information (Broad): {electionsError?.stack}
                        <p>{electionsError?.name}</p>
                        {electionsError?.message}
                    </code>
                </div>
            </div>
        </>
    };
    return (
        <>
            <div className="container">
                <div className="electionBoxes">
                    {user?.type === "administrator" ? (
                        <Button onClick={() => navigate('/create-election')}>
                            Create New Election
                        </Button>
                    ) : user?.type === 'super' && (
                        <Button onClick={() => navigate('/create-election')}>
                            Create New Election
                        </Button>
                    )}
                    {Array.isArray(elections) ? elections.map((election, index) => {
                        return <>
                            <Container className={`election-container container-${(index % 2) === 0 ? 'even' : 'odd'}`}>
                                <NavLink to={`/elections/${election.election_id}`}>
                                    <div
                                        key={election.election_id}
                                        className='boxes'
                                    >
                                        <h2 style={{ textDecoration: 'underline' }}>{election.title}</h2>
                                        <h4>{election.type === 'cpl' ? 'Copeland' : 'Instant-Runoff'}&nbsp;Election</h4>
                                        <p>{election.description}</p>
                                        <Row sm={1} lg={3}>
                                            <Col className='elections-col-created elections-dates'>
                                                <h6 className='elections-date-title'>Created At</h6>
                                                <p>
                                                    {monthNames[(new Date(election.createdAt).getMonth())]}&nbsp;
                                                    {new Date(election.createdAt).getDay().toString()},&nbsp;
                                                    {new Date(election.createdAt).getFullYear().toString()}
                                                </p>
                                            </Col>
                                            <Col className='elections-col-opened elections-dates'>
                                                <h6 className='elections-date-title'>Opens At</h6>
                                                <p>
                                                    {monthNames[(new Date(election.opensAt).getMonth())]}&nbsp;
                                                    {new Date(election.opensAt).getDay().toString()},&nbsp;
                                                    {new Date(election.opensAt).getFullYear().toString()}
                                                </p>
                                            </Col>
                                            <Col className='elections-col-closes elections-dates'>
                                                <h6 className='elections-date-title'>Closes At</h6>
                                                <p>
                                                    {monthNames[(new Date(election.closesAt).getMonth())]}&nbsp;
                                                    {new Date(election.closesAt).getDay().toString()},&nbsp;
                                                    {new Date(election.closesAt).getFullYear().toString()}
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <h6 style={{ textDecoration: 'underline' }}>Status</h6>
                                                {election.deleted ? 'Deleted' : 'Open'}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <div className="options">
                                            <h5>Options</h5>
                                            <ul className='options-list'>
                                                {election.options && election.options.map((option, index) => (
                                                    <li key={option}>{index + 1}.&nbsp;{option}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </NavLink>
                            </Container>
                        </>
                    }
                    ) : (
                        <>
                            <Card className='election-container p-3'>
                                <Card.Title><h1>Something is wrong with Elections</h1></Card.Title>
                                <hr />
                                <Card.Body style={{ textAlign: 'center' }}>
                                    <h4 style={{ textDecoration: 'underline' }}>Elections Type: {typeof (elections)}</h4>
                                    <code>{JSON.stringify(elections)}</code>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                    <Row>
                        <Col>
                            <Button onClick={handleNext}>Next</Button>
                        </Col>
                        {after >= 10 && (
                            <Col>
                                <Button onClick={handlePrev}>Previous</Button>
                            </Col>
                        )}
                    </Row>
                </div>
            </div>
        </>
    )
}