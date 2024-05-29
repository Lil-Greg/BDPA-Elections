import { useParams } from "react-router-dom";
import { UseSingleElection } from "../hooks/useElection"
import { Election } from "../type";

export default function ElectionPage() {
    const { electionId } = useParams();
    const election: Election | undefined = UseSingleElection(electionId || '');

    return (
        <>
            {election !== undefined && (
                election.title
            )}
        </>
    )
}