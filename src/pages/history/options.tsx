<<<<<<< Updated upstream
import { useQuery } from "@tanstack/react-query";
import { Election } from "../../type";
import { getElectionWinner } from "../../hooks/useElection";

export default function Options({ election }: { election: Election }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["getBallots", election],
        queryFn: () => getElectionWinner(election)
    })
    const winner = data;
    if (isLoading)
        return <>Loading...</>
    if (isError)
        return <>Error...</>
    return <div className='options-overlap-div'>
        {election?.options.map((option) => (
            <p key={option}
                className={`every-option option-${(winner === option) ? "winner" : "regular"}`}
            >{option}</p >
        )
        )}
    </div >
=======
import { useQuery } from "@tanstack/react-query"
import { Election } from "../../type"
import CacheFetch from "../../hooks/useCacheFetch"
import { cacheBallots } from "../../hooks/useElection"
import IRVElections from "../../algo/IRV-Elections"
import CPLElections from "../../algo/CPL-Elections"

export default function options (props: {election: Election}){
    const election= props.election
        const {data, isLoading, isError}= useQuery({
            queryKey:["ballots"],
            queryFn: cacheBallots(election.election_id)
        })
        switch(election.type){
            case "irv": 
             console.log(IRVElections(data.ballots))
             break;
             case "cpl":
                console.log(CPLElections(data.ballots))
                break;
                default: break;
        }

    return<>
    
    </>

>>>>>>> Stashed changes
}