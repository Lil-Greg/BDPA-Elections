import { NavLink } from "react-router-dom";
import { User } from "../../../type";
import UseElection from "../../../hooks/useElection";

type Props = {
    user: User | null
};
export default function AssignedElections({ user }: Props) {
    const { elections } = UseElection();
    const assignedElections = elections?.filter((election) => user?.assignedElections?.includes(election.election_id));
    return <>
        <h3 style={{ textDecoration: "underline" }}>{user?.username}&nbsp;Assigned Elections</h3>
        {assignedElections && assignedElections.length > 0
            ? assignedElections.map((election) => <NavLink to={`/elections/${election.election_id}`}>{election.title}</NavLink>)
            : <p>No Assignments</p>}
    </>
}