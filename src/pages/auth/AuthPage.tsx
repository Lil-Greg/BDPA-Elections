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
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { attempt } from 'lodash';
import getImageURL from '../../utils/image-util';

export default function AuthPage() {
    const getAllUsers = useQuery(api.users.get);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const captchaRef = useRef<HTMLInputElement>(null);
    const [passwordShow, setPasswordShow] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
    const [invalidCaptcha, setInvalidCaptcha] = useState(false);
    const { success, setParams, user } = useAuth();
    const [loginAttemptsRemaining, setLoginAttemptRemaining]= useState(3);
    

    const correctCaptcha = "12uI9045"; // Replace with actual captcha logic

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const captcha = captchaRef.current?.value;

        const checkUsername = getAllUsers?.filter(userData => userData.username === username);
        const checkPassword = getAllUsers?.filter(userData => userData.password === password);

        if (username && password && captcha && loginAttemptsRemaining>0) {
            if (captcha !== correctCaptcha) {
                setInvalidCaptcha(true);
                return;
            } else {
                setInvalidCaptcha(false);
            }

            setParams({
                username: username,
                password: password
            });

            if (success) {
                setInvalidUser(false);
                setUser && setUser(user);
                window.localStorage.setItem('election-user', JSON.stringify(user));
                navigate('/', { replace: true });
            } else if (success === false && (checkUsername?.length === 0 || checkPassword?.length === 0)) {
                setInvalidUser(true);
                setLoginAttemptRemaining(loginAttemptsRemaining-1)
            }
        } else {
            alert(`Please insert value`);
        }
    }

    const togglePasswordShow = () => {
        setPasswordShow(!passwordShow);
    }

    return (
        <Container className="mt-3" style={{ textAlign: 'center' }}>
            <h1>Login</h1>
            {invalidUser && (
                <p style={{ color: '#dc3545', display: 'inline' }}>User Does Not Exist</p>
            )}
             {loginAttemptsRemaining<=0 && (
                <p style={{ color: '#dc3545', display: 'inline' }}> You Have Been Locked Out For 1 Hour</p>
            )}
            <Form
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onSubmit={handleSubmit}
                className={invalidUser || loginAttemptsRemaining<=0 ? 'login-user-invalid' : ''}
            >
                <FloatingLabel
                    controlId="floatingInputUsername"
                    label="Username"
                    className='mb-3 w-50'
                >
                    <Form.Control autoComplete="off" type="text" ref={usernameRef} placeholder="Username" className={invalidUser ? 'is-invalid' : ''} />
                </FloatingLabel>

                <InputGroup className="mb-1 w-50">
                    <FloatingLabel
                        controlId="floatingInputPassword"
                        label="Password"
                    >
                        <Form.Control type={passwordShow ? "text" : "password"} placeholder="Password" ref={passwordRef} className={invalidUser ? 'is-invalid' : ''} />
                    </FloatingLabel>
                    <InputGroup.Text onClick={togglePasswordShow}>{passwordShow ? <FaRegEyeSlash /> : <FaRegEye />}</InputGroup.Text>
                </InputGroup>

                <InputGroup className="mb-3 w-50">
                    <FloatingLabel
                        controlId="floatingInputCaptcha"
                        label="Captcha"
                    >
                        <Form.Control type="text" placeholder="Enter Captcha" ref={captchaRef} className={invalidCaptcha ? 'is-invalid' : ''} />
                    </FloatingLabel>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <img src={getImageURL("Captcha.png")} alt="captcha" className="captcha-image" />
                </InputGroup>

                <Row>
                    <a className="m-1" style={{ textDecoration: 'none' }} href="/login/forgot"><h5>Forgot Password?</h5></a>
                </Row>
                <Row>
                    <NavLink to={'/register'}><h5>Sign Up</h5></NavLink>
                </Row>
                <Row className="mt-2 mb-4">
                    <Col xs="auto">
                    {loginAttemptsRemaining} Login Attempts Remaining

                    </Col>
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
    );
}
