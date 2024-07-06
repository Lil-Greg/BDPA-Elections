import './navbar.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Outlet } from "react-router-dom";
import { useContext } from 'react';
import UserContext from '../context/UserContext.ts';
import getImageURL from '../utils/image-util.ts';
import useInfoApi from '../hooks/useInfoApi.ts';

export default function Top() {
    const { user, isAuthenticated } = useContext(UserContext);
    const info = useInfoApi();

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand style={{ alignSelf: "start" }} href="/">
                        <img className='navHome' src={getImageURL('dc.png')}></img>&nbsp;D.C. Elections
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav style={{ textAlign: 'center', textEmphasis: '300', justifyContent: "space-between" }} className="me-auto navigation-element-container">
                            {isAuthenticated && (
                                <>
                                    <div className="nav-links">
                                        {user?.type !== "reporter" && (
                                            <Nav.Link href="/elections">Elections</Nav.Link>
                                        )}
                                        <Nav.Link href='/elections/history'>History</Nav.Link>
                                        <NavDropdown title="Election Info" id="basic-nav-dropdown">
                                            <NavDropdown.Item>
                                                Total:&nbsp;{(info?.info?.closedElections || 0) + (info?.info?.openElections || 0)}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item >
                                                Open:&nbsp;{info?.info?.openElections ? info.info.openElections : 0}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item>
                                                Closed:&nbsp;{info?.info?.closedElections}
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item>
                                                Total Owned:&nbsp;{ }
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </div>
                                    <div style={{ alignSelf: "end" }}>
                                        <Nav.Link href='/'>
                                            <img src={getImageURL('default-pfp.jpg')} alt={`${user?.username}'s Profile Picture`} className="pfp" />
                                        </Nav.Link>
                                    </div>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
            <Outlet></Outlet>
        </>
    )
}