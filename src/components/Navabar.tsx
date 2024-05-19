import "./navbar.css"
import useInfoApi from "../hooks/useInfoApi.ts"
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
    const openElectionNum = useInfoApi();
    const [totalElections, setTotalElections] = useState<number>();
    console.log(openElectionNum);
    if (openElectionNum) {
        setTotalElections(openElectionNum?.openElection + openElectionNum?.closedElections + openElectionNum?.upcomingElections);
    }
    return (
        <>
            <nav className="navMenu">
                <a href="" className="navHome"><img src="dc.png"></img></a>
                <ul>
                    <li>
                        <a href="/Dashboard">Dashboard</a>
                    </li>
                    <li>
                        <a href="/History">History</a>
                    </li>
                    <li>
                        <a href="/Elections">Elections: Open: {openElectionNum?.openElection} Closed:{openElectionNum?.closedElections} Total:{totalElections}</a>
                    </li>
                </ul>
            </nav>
            <Outlet></Outlet>
        </>
    )
}