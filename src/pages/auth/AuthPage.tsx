import './AuthPage.css';
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useContext, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import useAuth from "../../hooks/useAuth";
import { Button, Col, Container, InputGroup, Row } from 'react-bootstrap';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import GetIp from '../../hooks/getIp';

export default function AuthPage() {
    const getAllUsers = useQuery(api.users.get);
    const { userIp } = GetIp();
    const setIpAndLogin = useMutation(api.users.setIpAndRecentLogin);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [passwordShow, setPasswordShow] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        // event.preventDeault will prevent the page to refresh after the alert
        event.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        const checkUsername = getAllUsers?.filter(userData => userData.username === username);
        const checkPassword = getAllUsers?.filter(userData => userData.password === password);

        if (!userIp) {
            throw Error("User's IP is Undefined");
        };
        if (checkUsername) {
            setIpAndLogin({ id: checkUsername[0]._id, ip: userIp });
        };
        if (username && password) {
            if (checkPassword && checkPassword.length>0) {
                setInvalidUser(false);
<<<<<<< HEAD
                setUser && setUser(checkPassword[0]); // Set Types
                window.localStorage.setItem('election-user', JSON.stringify(checkPassword[0]));
=======
                setUser && setUser(user);
                window.localStorage.setItem('election-user', JSON.stringify(user));
>>>>>>> Elections-And-History
                navigate('/', { replace: true });
            } else if (checkUsername?.length === 0 || checkPassword?.length === 0) {
                setInvalidUser(true);
            }
        } else {
            alert(`Please insert value`);
        }
    }
    const togglePasswordShow = () => {
        setPasswordShow(!passwordShow);
    }
    return <>
        <Container className="mt-3" style={{ textAlign: 'center' }}>
            <h1>Login</h1>
            {invalidUser && (
                <p style={{ color: '#dc3545', display: 'inline' }}>User Does Not Exist</p>
            )}
            <Form
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onSubmit={handleSubmit}
                className={invalidUser ? 'login-user-invalid' : ''}
            >
                <FloatingLabel
                    controlId="floatingInputUsername"
                    label="Username"
                    className='mb-3 w-50'
                >
                    <Form.Control autoComplete="off" type="text" ref={usernameRef} placeholder="Username" />
                </FloatingLabel>

                <InputGroup className="mb-1 w-50">
                    <FloatingLabel
                        controlId="floatingInputPassword"
                        label="Password"
                    >
                        <Form.Control type={passwordShow ? "text" : "password"} placeholder="Password" ref={passwordRef} />
                    </FloatingLabel>
                    <InputGroup.Text onClick={togglePasswordShow}>{passwordShow ? <FaRegEyeSlash /> : <FaRegEye />}</InputGroup.Text>
                </InputGroup>
                <Row>

                    <a className="m-1" style={{ textDecoration: 'none' }} href="/forgot"><h5>Forgot Password?</h5></a>
                </Row>
                <Row>
                    <NavLink to={'/register'}><h5>Sign Up</h5></NavLink>
                </Row>
                <Row className="mt-2 mb-4">
                    <Col xs="auto">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Col>
                    <Col xs="auto" style={{ textAlign: 'center' }}>
                        <Form.Check
                            type="checkbox"
                            id="autoSizingCheck"
                            className="mb-2"
                            label="Remember me"
                            style={{ fontSize: '1.1rem' }}
                        />
                    </Col>
                </Row>
            </Form>
        </Container>
    </>
}