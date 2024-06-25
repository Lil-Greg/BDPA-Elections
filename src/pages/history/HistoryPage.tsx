import './HistoryPage.css';
import { NavLink } from "react-router-dom";
import useElectionHistory from "../../hooks/useElectionHistory";
import { Container } from 'react-bootstrap';
import getImageURL from '../../utils/image-util';
import handlePrev from "../../hooks/useElectionHistory"
import handleNext from "../../hooks/useElectionHistory"
const { elections, isLoading, isErroring } = useElectionHistory();

function sortByAlphabet(){
    // elections?.elections.sort((a, b) => a.createdAt - b.createdAt);
}
export default function HistoryPage() {
    console.log(elections?.elections);
    elections?.elections.sort((a, b) => a.createdAt - b.createdAt);
    console.log(elections?.elections);
    const openElectionNum = useInfoApi();
    const totalElections = openElectionNum ? openElectionNum?.info.openElection + openElectionNum?.info.closedElections + openElectionNum?.info.upcomingElections : 0;
    if (isLoading) {
        return <>
            <div className="loadingText">Loading...</div>
        </>
    }
    if (isErroring) {
        return <>
            <div className="errorCard">
                <div className="errorMessage">
                    <img src={getImageURL('errorMagnifier.svg')} alt="Error Magnifier" />
                    <p>Something went wrong!</p>
                </div>
            </div>
        </>
    }
    return (
        <>
            <div className="container">
                <div className="electionBoxes">
                    {elections && elections.elections.map((election, index) => (
                        <Container className={`election-container container-${(index % 2) === 0 ? 'even' : 'odd'}`}>
                            <NavLink to={`/elections/${election.election_id}`}>
                                <div
                                    key={election.election_id}
                                    className='boxes'
                                >
                                    <h3>{election.title}</h3>
                                    <p>{election.description}</p>
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
                    ))}
                    <div className="pageButtons">
                        <button onClick={handlePrev}>Prev</button>
                        <button onClick={handleNext}>Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}