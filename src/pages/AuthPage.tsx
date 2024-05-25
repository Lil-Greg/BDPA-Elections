import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import userAuth from "../hooks/useAuth";
import { Button, Col, Container, InputGroup, ProgressBar, Row } from 'react-bootstrap';

export default function AuthPage() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [progress, setProgress] = useState<number>(0);
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        // event.preventDeault will prevent the page to refresh after the alert
        event.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (username && password) {
            const [isAuthorized, userInline] = await userAuth(password, username);
            if (isAuthorized) {
                setUser && setUser(userInline);
                window.localStorage.setItem('election-user', JSON.stringify(user))
                navigate('/')
            }
            alert(`Username: ${username}` + ` Password: ${password}`)
        } else {
            alert(`Please insert value`)
        }
    }
    const handlePasswordChange = () => {
        const password = passwordRef.current?.value;
        const passwordLength = password?.length || 0;
        setProgress(passwordLength);
    }
    const handleUsernameChange = () => {
        const username = usernameRef.current?.value;
        setInvalidUsername((/[^0-9a-zA-Z]+/ig).test(username || ''));
    }
    const togglePasswordShow = () => {
        setPasswordShow(!passwordShow);
    }
    return <>
        <Container className="mt-3" style={{ textAlign: 'center' }}>
            <h1>Login</h1>
            <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Username"
                    className='mb-3 w-50'
                >
                    <Form.Control autoComplete="off" isInvalid={invalidUsername} type="text" ref={usernameRef} placeholder="Username" onChange={handleUsernameChange} />
                    <Form.Control.Feedback type='invalid'>Must Be Alpha-Numeric</Form.Control.Feedback>
                </FloatingLabel>

                <InputGroup className="mb-3 w-50">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Password"
                    >
                        <Form.Control type={passwordShow ? "text" : "password"} placeholder="Password" ref={passwordRef} onChange={handlePasswordChange} />
                    </FloatingLabel>
                    <InputGroup.Text onClick={togglePasswordShow}>{passwordShow ? <FaRegEyeSlash /> : <FaRegEye />}</InputGroup.Text>
                </InputGroup>
                {passwordRef.current?.value && (
                    <ProgressBar now={progress} max={18} variant={progress > 17 ? 'success' : progress <= 10 ? 'danger' : 'warning'} />
                )}
                <Row>
                    <a className="m-1" style={{ textDecoration: 'none' }} href=""><h5>Forgot Password?</h5></a>
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
                <Row>
                    <p>Do you have an account? <a href="/register">Sign Up</a></p>
                </Row>
            </Form>
        </Container>
    </>
}