import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import useAuth from "../../hooks/useAuth";
import { Button, Col, Container, InputGroup, Row } from 'react-bootstrap';

export default function AuthPage() {

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [passwordShow, setPasswordShow] = useState(false);
    const { success, setParams, user } = useAuth();

    const handleSubmit = (event: React.FormEvent) => {
        // event.preventDeault will prevent the page to refresh after the alert
        event.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (username && password) {
            setParams({
                username: username,
                password: password
            });
            if (success) {
                setUser && setUser(user); // Set Types
                window.localStorage.setItem('election-user', JSON.stringify(user));
                navigate('/', { replace: true });
            }
            alert(`Username: ${username}` + ` Password: ${password}`)
        } else {
            alert(`Please insert value`)
        }
    }
    const togglePasswordShow = () => {
        setPasswordShow(!passwordShow);
    }
    return <>
        <Container className="mt-3" style={{ textAlign: 'center' }}>
            <h1>Login</h1>
            <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
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

                    <a className="m-1" style={{ textDecoration: 'none' }} href="/login/forgot"><h5>Forgot Password?</h5></a>
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