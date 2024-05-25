import useElectionHistory from "../hooks/useElectionHistory";
import "./History.css"

export default function ElectionHistory(){
    const elections = useElectionHistory();
    //console.log(isLoading);
    console.log(elections);

    /*if (isLoading) {
        return <>
            <div className="loadingText">Loading...</div>
        </>
    }*/

    return <>
       <div>
        <h2>History</h2>
            {elections && elections?.elections.map(election => (
                <div className="electionBox">
                    <div key={election?.election_id}>
                        <h3 className="electionTitle">{election?.title}</h3>
                        <p className="electionDescript">{election?.description}</p>
                        <ul>
                            {election?.options.map(option => (
                                <div className="electionOption"><li key={option}>{option}</li></div>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    </>
}