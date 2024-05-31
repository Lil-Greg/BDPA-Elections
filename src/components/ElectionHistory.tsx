import useElectionHistory from "../hooks/useElectionHistory";
import "./History.css"

export default function ElectionHistory(){
    const { elections, isLoading } = useElectionHistory();
    console.log(isLoading);
    console.log(elections);

    if (isLoading) {
        return <>
            <div className="loadingText">Loading...</div>
        </>
    }

    return <>
       <div>
            {elections && elections.elections.map(election => (
                <div className="electionBox">
                <div key={election.election_id}>
                    <h3 className="electionTitle">{election.title}</h3>
                    <p>{election.description}</p>
                    <ul>
                        {election.options.map(option => (
                            <li key={option}>{option}</li>
                        ))}
                    </ul>
                </div>
                </div>
            ))}
            <div className="pageButtons">
                <button>Prev</button>
                <button>Next</button>
            </div>
        </div>
    </>
}