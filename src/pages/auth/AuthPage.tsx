import './AuthPage.css';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useContext, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { Button, Col, Container, InputGroup, Row } from 'react-bootstrap';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import getImageURL from '../../utils/image-util';
import GetIp from '../../hooks/getIp';

/* Checks and Stores User information */

export default function AuthPage() {
    const { userIp } = GetIp();
    const setIpAndLogin = useMutation(api.users.setIpAndRecentLogin);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [passwordShow, setPasswordShow] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
    const [remember, setRemember] = useState(false);
    const authUser = useQuery(api.users.auth, { username: usernameState, password: passwordState });
    const captchaRef = useRef<HTMLInputElement>(null);
    const [invalidCaptcha, setInvalidCaptcha] = useState(false);
    const [loginAttemptsRemaining, setLoginAttemptsRemaining] = useState(3);

    const correctCaptcha = "12uI9045";

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const captcha = captchaRef.current?.value;

        if (authUser && authUser.length > 0 && captcha && loginAttemptsRemaining > 0) {
            if (!userIp) {
                throw Error("User's IP is Undefined");
            };
            if (captcha === correctCaptcha) {
                setInvalidCaptcha(false);
                setIpAndLogin({ id: authUser[0]._id, ip: userIp });
                if (username && password) {
                    setInvalidUser(false);
                    setUser && setUser(authUser[0]); // Set Types
                    remember === true ? window.localStorage.setItem('election-user', JSON.stringify(authUser[0]))
                        : window.sessionStorage.setItem("election-user", JSON.stringify(authUser[0]));
                    navigate('/', { replace: true });
                } else {
                    setInvalidUser(true);
                    setLoginAttemptsRemaining(loginAttemptsRemaining - 1);
                }
            } else {
                setInvalidCaptcha(true);
                setLoginAttemptsRemaining(loginAttemptsRemaining - 1);
            }
        } else if (authUser === undefined || authUser?.length === 0) {
            setInvalidUser(true);
            setLoginAttemptsRemaining(loginAttemptsRemaining - 1);
        }
    };
    const togglePasswordShow = () => {
        setPasswordShow(!passwordShow);
    }
    return <Container className="mt-3" style={{ textAlign: 'center' }}>
        <h1>Login</h1>
        {invalidUser && (
            <p style={{ color: '#dc3545', display: 'inline' }}>User Does Not Exist</p>
        )}
        {invalidCaptcha && (
            <p style={{ color: '#dc3545', display: 'inline' }}>Incorrect Captcha. Please try again.</p>
        )}
        {loginAttemptsRemaining <= 0 && (
            <p style={{ color: '#dc3545', display: 'inline' }}> You Have Been Locked Out For 1 Hour</p>
        )}
        <Form
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onSubmit={handleSubmit}
            className={invalidUser || loginAttemptsRemaining <= 0 ? 'login-user-invalid' : ''}
        >
            <FloatingLabel
                controlId="floatingInputUsername"
                label="Username"
                className='mb-3 w-50'
            >
                <Form.Control
                    autoComplete="off"
                    type="text"
                    ref={usernameRef}
                    placeholder="Username"
                    onChange={(e) => { setUsernameState(e.currentTarget.value) }}
                />
            </FloatingLabel>

            <InputGroup className="mb-1 w-50">
                <FloatingLabel
                    controlId="floatingInputPassword"
                    label="Password"
                >
                    <Form.Control
                        type={passwordShow ? "text" : "password"}
                        placeholder="Password"
                        ref={passwordRef}
                        onChange={(e) => { setPasswordState(e.currentTarget.value) }}
                    />
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
                        onChange={() => { setRemember(!remember) }}
                        label="Remember me"
                        style={{ fontSize: '1.1rem' }}
                    />
                </Col>
            </Row>
        </Form>
    </Container>
}
