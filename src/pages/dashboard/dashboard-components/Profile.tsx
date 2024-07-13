import React, { useContext, useRef, useState } from "react";
import UserContext from "../../../context/UserContext";
import { Button, Col, Container, Form, InputGroup, ProgressBar, Row } from "react-bootstrap";
import { TbPencil, TbPencilOff } from "react-icons/tb";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { User } from "../../../type";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function Profile() {
    const { user, setUser } = useContext(UserContext);
    if (user === null) {
        console.warn("User is null");
        return;
    }
    const getAllUsers = useQuery(api.users.get);
    const changeUser = useMutation(api.users.changeUserInProfile);

    const [noValue, setNoValue] = useState<boolean>(true);
    const [editState, setEditState] = useState<boolean>(false);

    const usernameRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [passwordShow, setPasswordShow] = useState(false);
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [sameUsername, setSameUsername] = useState(false);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleEditMode = () => {
        setEditState(!editState);
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;
        const email = emailRef.current?.value;
        if (username || password || firstName || lastName || email !== null && noValue === false) {
            const formValues = {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                email: email
            }
            if (user === null || user === undefined) {
                alert("No User");
                return;
            } else {
                changeUser({ id: user._id, selectedField: formValues });
                localStorage.setItem("election-user", JSON.stringify({
                    address: user.address,
                    city: user.city,
                    email: email,
                    firstName: firstName,
                    key: user.key,
                    lastName: lastName,
                    password: password,
                    salt: user.salt,
                    state: user.state,
                    type: user.type,
                    username: username,
                    zip: user.zip,
                    _creationTime: user._creationTime,
                    _id: user._id
                }));
                const gettingStorage = localStorage.getItem("election-user");
                const newUser: User | null = gettingStorage ? JSON.parse(gettingStorage) : null;
                setUser && setUser(() => newUser);
                setEditState(false);
            }
        } else {
            alert("Put Some Values");
        }
    }

    const togglePasswordShow = () => {
        setPasswordShow(!passwordShow);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = passwordRef.current?.value;
        const passwordLength = password?.length || 0;
        setProgress(passwordLength);
        e.currentTarget.value !== e.currentTarget.defaultValue ? setNoValue(false) : setNoValue(true)
    }
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = usernameRef.current?.value;
        const checkForSameUsername = getAllUsers?.filter(userData => userData.username === username && userData._id !== user?._id);
        checkForSameUsername?.length === 0 ? setSameUsername(false) : setSameUsername(true);
        setInvalidUsername((/[^0-9a-zA-Z]+/ig).test(username || ''));
        e.currentTarget.value !== e.currentTarget.defaultValue ? setNoValue(false) : setNoValue(true)
    }
    return (
        <>
            <Container>
                <Button className="mb-2" onClick={handleEditMode}>Toggle Edit Mode {editState === false ? (
                    <TbPencil size={'1.5rem'} />) : (
                    <TbPencilOff size={'1.5rem'} />
                )}
                </Button>
                {editState === true ? (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-2">
                            <Col>
                                <Form.FloatingLabel
                                    controlId="firstName"
                                    label='First Name'
                                >

                                    <Form.Control type="text" defaultValue={user?.firstName} autoComplete="off" placeholder="First Name" ref={firstNameRef} onChange={(e) => {
                                        e.currentTarget.value !== e.currentTarget.defaultValue ? setNoValue(false) : setNoValue(true)
                                    }} />
                                </Form.FloatingLabel>
                            </Col >
                            <Col>
                                <Form.FloatingLabel
                                    controlId="lastName"
                                    label='Last Name'
                                >
                                    <Form.Control type="text" defaultValue={user?.lastName} autoComplete="off" placeholder="Last Name" ref={lastNameRef} onChange={(e) => {
                                        e.currentTarget.value !== e.currentTarget.defaultValue ? setNoValue(false) : setNoValue(true)
                                    }} />
                                </Form.FloatingLabel>
                            </Col>
                        </Row >
                        <Row className="mb-2">
                            <Col>
                                <Form.FloatingLabel
                                    controlId="username"
                                    label='Username'
                                >
                                    <Form.Control
                                        type="text"
                                        defaultValue={user?.username}
                                        autoComplete="off"
                                        placeholder="Username"
                                        onChange={handleUsernameChange}
                                        isInvalid={invalidUsername === true ? invalidUsername : sameUsername}
                                        ref={usernameRef}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {invalidUsername === true ? 'Must Be Alpha-Numeric' : sameUsername === true && 'Already A User With This Username'}
                                    </Form.Control.Feedback>
                                </Form.FloatingLabel>
                            </Col>
                            <Col>
                                <Form.FloatingLabel
                                    controlId="email"
                                    label='Email'
                                >

                                    <Form.Control type="email" defaultValue={user?.email} autoComplete="off" placeholder="Email" ref={emailRef} onChange={(e) => {
                                        e.currentTarget.value !== e.currentTarget.defaultValue ? setNoValue(false) : setNoValue(true)
                                    }} />
                                </Form.FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <InputGroup className="mb-1">
                                <Form.FloatingLabel
                                    controlId="password"
                                    label="Password"
                                >
                                    <Form.Control type={passwordShow ? "text" : "password"} defaultValue={user?.password} autoComplete="off" placeholder="Password" onChange={handlePasswordChange} ref={passwordRef} />
                                </Form.FloatingLabel>
                                <InputGroup.Text onClick={togglePasswordShow}>{passwordShow ? <FaRegEyeSlash /> : <FaRegEye />}</InputGroup.Text>
                            </InputGroup>
                            <ProgressBar now={progress} max={18} variant={progress > 17 ? 'success' : progress <= 10 ? 'danger' : 'warning'} style={{ width: '80vw' }} />
                        </Row>
                        <Button type="submit"
                            variant={noValue === true ? 'danger' : 'success'}>
                            Change Data
                        </Button>
                    </Form>
                ) : (
                    <>
                        <Row className="row mb-2">
                            <Col className="col-6">
                                <h4 style={{ textDecoration: "underline" }}>First Name</h4>
                                <p className="h6 profile-page dashboard-firstName">{user?.firstName}</p>
                            </Col >
                            <Col className="col-6">
                                <h4 style={{ textDecoration: "underline" }}>Last Name</h4>
                                <p className="h6 profile-page dashboard-lastName">{user?.lastName}</p>
                            </Col>
                            <Col className="col-6">
                                <h4 style={{ textDecoration: "underline" }}>Username</h4>
                                <div className="h6 profile-page dashboard-username">{user?.username}</div>
                            </Col>
                            <Col className="col-6">
                                <h4 style={{ textDecoration: "underline" }}>Email</h4>
                                <p className="h6 profile-page dashboard-email">{user?.email}</p>
                            </Col>
                            <Col className="col-6">
                                <h4 style={{ textDecoration: "underline" }}>Current IP</h4>
                                <p className="h6 profile-page dashboard-email">{user?.ip}</p>
                            </Col>
                            <Col className="col-6">
                                <h4 style={{ textDecoration: "underline" }}>Previous Login</h4>
                                <p className="h6 profile-page dashboard-email">
                                    {user.pastLogin && (<span>
                                        {monthNames[new Date(user.pastLogin[0]).getMonth()]}&nbsp;
                                        {new Date(user.pastLogin[0]).getDate()},&nbsp;
                                        {new Date(user.pastLogin[0]).getFullYear()},&nbsp;
                                        {new Date(user.pastLogin[0]).getHours() > 12 ? new Date(user.pastLogin[0]).getHours() - 12 : new Date(user.pastLogin[0]).getHours()}:
                                        {new Date(user.pastLogin[0]).getMinutes()}&nbsp;
                                        {new Date(user.pastLogin[0]).getHours() > 12 ? "P.M." : "A.M."}
                                    </span>
                                    )}
                                </p>
                            </Col>
                        </Row>
                    </>

                )
                }


            </Container >
        </>
    )
}