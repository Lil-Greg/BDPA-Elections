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
            <Navbar expand="lg" style={{}} className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/"><img className='navHome' src={getImageURL('dc.png')}></img>&nbsp;D.C. Elections</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav style={{ textAlign: 'center', textEmphasis: '300' }} className="me-auto navigation-element-container">
                            <Nav.Link href="/elections">Elections</Nav.Link>
                            <NavDropdown title="Election Info" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">
                                    Total:&nbsp;{(info?.info?.closedElections || 0) + (info?.info?.openElection || 0)}
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Open:&nbsp;{info?.info?.openElection ? info.info.openElection : 0}
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">
                                    Closed:&nbsp;{info?.info?.closedElections}
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav>
                                {isAuthenticated ? (
                                    <Nav.Link href='/'>
                                        <img src={getImageURL('default-pfp.jpg')} alt={`${user?.username}'s Profile Picture`} className="pfp" />
                                    </Nav.Link>
                                ) : (
                                    <Nav.Link href='/login'>
                                        Login
                                    </Nav.Link>
                                )}
                            </Nav>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet></Outlet>
        </>
    )
}