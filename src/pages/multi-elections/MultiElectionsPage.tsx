import './MultiElectionsPage.css';
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Col, Container, Row } from 'react-bootstrap';
import getImageURL from '../../utils/image-util';
import handlePrev from "../../hooks/useElectionHistory";
import handleNext from "../../hooks/useElectionHistory";
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
import UseElection from '../../hooks/useElection';

export default function MultiElectionsPage() {
    const { electionStatus, isLoading, isErroring } = UseElection();
    const monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
                    <p>Something went wrong!</p>
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
                    {electionStatus && electionStatus.map((election, index) => <>
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
                                                {monthNames[(new Date(election.createdAt).getUTCMonth())]}&nbsp;
                                                {new Date(election.createdAt).getDay().toString()},&nbsp;
                                                {new Date(election.createdAt).getFullYear().toString()}
                                            </p>
                                        </Col>
                                        <Col className='elections-col-opened elections-dates'>
                                            <h6 className='elections-date-title'>Opens At</h6>
                                            <p>
                                                {monthNames[(new Date(election.opensAt).getUTCMonth())]}&nbsp;
                                                {new Date(election.opensAt).getDay().toString()},&nbsp;
                                                {new Date(election.opensAt).getFullYear().toString()}
                                            </p>
                                        </Col>
                                        <Col className='elections-col-closes elections-dates'>
                                            <h6 className='elections-date-title'>Closes At</h6>
                                            <p>
                                                {monthNames[(new Date(election.closesAt).getUTCMonth())]}&nbsp;
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
                                            {election.options.map((option, index) => (
                                                <li key={option}>{index + 1}.&nbsp;{option}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </NavLink>
                        </Container>
                    </>
                    )}
                    <div className="pageButtons">
                        <button onClick={handlePrev}>Prev</button>
                        <button onClick={handleNext}>Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}