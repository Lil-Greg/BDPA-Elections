import useElectionHistory from "../hooks/useElectionHistory";

export default function ElectionHistory(){
    const elections = useElectionHistory;

    return <>
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Opens At</th>
                    <th>Closes At</th>
                </tr>
            </thead>
            <tbody>
                {elections.map((elections, index) => (
                    <tr key={index}>
                        <td>{elections.title}</td>
                        <td>{elections.description}</td>
                        <td>{elections.createdAt}</td>
                        <td>{elections.opensAt}</td>
                        <td>{elections.closesAt}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
}