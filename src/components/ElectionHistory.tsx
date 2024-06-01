import useElectionHistory from "../hooks/useElectionHistory";
import errorMagnifier from "../assets/errorMagnifier.svg"
import "./History.css"
import { NavLink } from "react-router-dom";

export default function ElectionHistory(){
    const { elections, isLoading, isErroring} = useElectionHistory();
    console.log(isLoading);
    console.log(elections);

    if (isLoading) {
        return <>
            <div className="loadingText">Loading...</div>
        </>
    }
    if(isErroring){
        return <>
        <div className="errorCard">
            <div className="errorMessage">
                <img src={errorMagnifier} alt="Error Magnifier" />
                <p>Something went wrong!</p>
            </div>
        </div>
        </>
    }

    return <>
       <div>
            {elections && elections.elections.map(election => (
                <NavLink to={`/history/${election.election_id}`}>
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
                </NavLink>
            ))}
            <div className="pageButtons">
                <button>Prev</button>
                <button>Next</button>
            </div>
        </div>
    </>
}