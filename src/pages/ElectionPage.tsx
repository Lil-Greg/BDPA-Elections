import UseElection from "../hooks/useElection"
import { Elections } from "../type";

export default function ElectionPage() {
    const Elections: Elections = UseElection();
    return (
        <>
            {Elections.elections.map((name, id) => {
                <div className="election">{id}
                    <div className="name">
                        <h1>{name.election.title}</h1>
                    </div>
                    <div className="election-decription">
                        <p className="description">{name.election.description}</p>
                    </div>
                </div>
            })}
        </>
    )
}