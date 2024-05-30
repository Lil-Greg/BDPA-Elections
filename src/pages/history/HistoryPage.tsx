import './HistoryPage.css';
import { NavLink } from "react-router-dom";
import useElectionHistory from "../../hooks/useElectionHistory";
import { Container } from 'react-bootstrap';


export default function HistoryPage() {
    const { elections, isLoading } = useElectionHistory();
    console.log(isLoading);
    console.log(elections);

    if (isLoading) {
        return <>
            <div className="loadingText">Loading...</div>
        </>
    }
    return (
        <>
            <div className="container">
                <div className="electionBoxes">
                    {elections && elections.elections.map((election, index) => (
                        <Container className={`election-container container-${(index % 2) === 0 ? 'even' : 'odd'}`}>
                            <NavLink to={`/history/${election.election_id}`}>
                                <div
                                    key={election.election_id}
                                    className='boxes'>
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
                </div>
            </div>
        </>
    )
}