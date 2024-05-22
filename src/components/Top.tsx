import './navbar.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import useInfoApi from "../hooks/useInfoApi.ts"
import { Outlet } from "react-router-dom";
import { useContext } from 'react';
import UserContext from '../context/UserContext.ts';

export default function Top() {
    const { user, isAuthenticated } = useContext(UserContext);
    const openElectionNum = useInfoApi();
    const totalElections = openElectionNum ? openElectionNum?.info.openElection + openElectionNum?.info.closedElections + openElectionNum?.info.upcomingElections : 0;
    return (
        <>
            <Navbar expand="lg" style={{ width: "100vw" }} className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/"><img className='navHome' src="dc.png"></img>&nbsp;D.C. Elections</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav style={{ textAlign: 'center' }} className="me-auto">
                            <Nav.Link href="/history">History</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
                                </NavDropdown.Item>
                            </NavDropdown>
                            {isAuthenticated ? (
                                <>
                                    <p>Hello, {user?.username}</p>
                                    <Nav.Link href="/elections">
                                        Open Elections: {openElectionNum?.info.openElection} &nbsp; Closed Elections: {openElectionNum?.info.closedElections} &nbsp; Total Elections: {totalElections}
                                    </Nav.Link>
                                </>

                            ) : (
                                <Nav.Link href='/login'>
                                    Login
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet></Outlet>
        </>
    )
}