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
}