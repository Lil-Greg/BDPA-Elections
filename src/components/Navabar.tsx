import "./navbar.css"
import useInfoApi from "../hooks/useInfoApi"
import { Outlet } from "react-router-dom";
//import "../public/dc.png"

export default function Navbar() {
    const openElectionNum = useInfoApi();
    console.log(openElectionNum);
    const totalElections = openElectionNum?.openElections + openElectionNum?.closedElections + openElectionNum?.upcomingElections;
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
                    <a href="/Elections">Elections: Open: {openElectionNum?.openElections} Closed:{openElectionNum?.closedElections} Total:{totalElections}</a>
                </li>
            </ul>
        </nav>
        <Outlet></Outlet>
        </>
    )
}