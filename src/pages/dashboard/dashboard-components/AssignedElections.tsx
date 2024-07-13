import { NavLink } from "react-router-dom";
import { User } from "../../../type";
import { useQuery } from "@tanstack/react-query";
import getAllElections from "../../../hooks/useElection";

type Props = {
    user: User | null,
};
export default function AssignedElections({ user }: Props) {
    const { data } = useQuery({
        queryKey: ["GetAllElections"],
        queryFn: () => getAllElections(),
    });
    const elections = data;
    const assignedElections = elections?.filter((election) => user?.assignedElections?.includes(election.election_id));
    return <>
        <h3 style={{ textDecoration: "underline" }}>{user?.username}&nbsp;Assigned Elections</h3>
        <div className="row">
            {assignedElections && assignedElections.length > 0
                ? assignedElections.map((election) => <NavLink
                    to={`/elections/${election.election_id}`}
                    className="col-4"
                // style={{ textDecoration: "none" }}
                >
                    {election.title}
                </NavLink>)
                : <p>No Assignments</p>}
        </div>
    </>
}