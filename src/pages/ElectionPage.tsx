import UseElection from "../hooks/useElection"
import { ElectionsStatus } from "../type";

export default function ElectionPage() {
    const elections: ElectionsStatus | undefined = UseElection();
    return (
        <>
            {elections?.elections.map((election, id) =>

                <div className="election">
                    <div className="name">
                        <h1>{election.title}</h1>
                        <div className="id">{id}</div>
                    </div>
                    <div className="election-decription">
                        <p className="description">{election.description}</p>
                    </div>
                </div>
            )}

        </>
    )
}