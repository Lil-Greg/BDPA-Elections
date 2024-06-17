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
                        <Nav style={{ textAlign: 'center', textEmphasis: '300' }} className="me-auto">
                            <Nav.Link href="/elections">Elections</Nav.Link>
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
                                    <Nav.Link href='/'>
                                        <img src={getImageURL('default-pfp.jpg')} alt={`${user?.username}'s Profile Picture`} className="pfp" />
                                    </Nav.Link>
                                </>

                            ) : (
                                <Nav.Link href='/login'>
                                    Login
                                </Nav.Link>
                            )}
                        </Nav>
                        <Nav style={{ textAlign: 'end', textEmphasis: '300' }}>
                            <h4>Elections Info:</h4>
                            Total: {info?.info?.closedElections + info?.info?.openElections} Closed:{info?.info?.closedElections} Open:{info?.info?.openElections}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet></Outlet>
        </>
    )
}