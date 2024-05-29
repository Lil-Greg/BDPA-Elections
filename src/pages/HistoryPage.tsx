import { NavLink } from "react-router-dom";
import useElectionHistory from "../hooks/useElectionHistory";


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
                    <div>
                        {elections && elections.elections.map(election => (
                            <NavLink to={`/history/${election.election_id}`}>
                                <div key={election.election_id}>
                                    <h3>{election.title}</h3>
                                    <p>{election.description}</p>
                                    <ul>
                                        {election.options.map(option => (
                                            <li key={option}>{option}</li>
                                        ))}
                                    </ul>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}