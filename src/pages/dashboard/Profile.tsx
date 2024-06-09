import React, { useContext, useRef, useState } from "react";
import UserContext from "../../context/UserContext";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { User } from "../../type";

export default function Profile() {
    const { user, setUser } = useContext(UserContext);
    const changeUser = useMutation(api.users.changeUser);

    const [noValue, setNoValue] = useState<boolean>(true);
    const [editState, setEditState] = useState<boolean>(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const handleEditMode = () => {
        setEditState(!editState);
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const username = usernameRef.current?.value;
        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;
        const email = emailRef.current?.value;
        if (username || firstName || lastName || email !== null) {
            setNoValue(false);
            const formValues = {
                username: username,
                password: user?.password,
                firstName: firstName,
                lastName: lastName,
                email: email
            }
            if (user === null || user === undefined) {
                alert("No User");
            } else {
                changeUser({ id: user._id, selectedField: formValues });
                localStorage.setItem("election-user", JSON.stringify({
                    address: user.address,
                    city: user.city,
                    email: email,
                    firstName: firstName,
                    key: user.key,
                    lastName: lastName,
                    password: user.password,
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
            alert("Input Values");
            setNoValue(true);
        }
    }

    return (
        <>
            <Container>
                <Button className="mb-2" onClick={handleEditMode}>Toggle Edit Mode {editState === true ?? (
                    <BsPencilSquare />)}
                </Button>
                {editState === true ? (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-2">
                            <Col>
                                <Form.FloatingLabel
                                    controlId="firstName"
                                    label='First Name'
                                >

                                    <Form.Control defaultValue={user?.firstName} autoComplete="off" placeholder="First Name" ref={firstNameRef} />
                                </Form.FloatingLabel>
                            </Col >
                            <Col>
                                <Form.FloatingLabel
                                    controlId="lastName"
                                    label='Last Name'
                                >
                                    <Form.Control defaultValue={user?.lastName} autoComplete="off" placeholder="Last Name" ref={lastNameRef} />
                                </Form.FloatingLabel>
                            </Col>
                        </Row >
                        <Row className="mb-2">
                            <Col>
                                <Form.FloatingLabel
                                    controlId="username"
                                    label='Username'
                                >
                                    <Form.Control defaultValue={user?.username} autoComplete="off" placeholder="Username" ref={usernameRef} />
                                </Form.FloatingLabel>
                            </Col>
                            <Col>
                                <Form.FloatingLabel
                                    controlId="email"
                                    label='Email'
                                >

                                    <Form.Control defaultValue={user?.email} autoComplete="off" placeholder="Email" ref={emailRef} />
                                </Form.FloatingLabel>
                            </Col>
                        </Row>
                        <Button type="submit"
                            variant={noValue === true ? 'warning' : 'success'}>
                            Change Data
                        </Button>
                    </Form>
                ) : (
                    <>
                        <Row className="mb-2">
                            <Col>
                                <p className="profile-page dashboard-firstName">First Name:&nbsp;{user?.firstName}</p>
                            </Col >
                            <Col>
                                <p className="profile-page dashboard-lastName">Last Name:&nbsp;{user?.lastName}</p>
                            </Col>
                        </Row >
                        <Row>
                            <Col>
                                <div className="profile-page dashboard-username">Username:&nbsp;{user?.username}</div>
                            </Col>
                            <Col>
                                <p className="profile-page dashboard-email">Email:&nbsp;{user?.email}</p>
                            </Col>
                        </Row>
                    </>

                )
                }


            </Container >
        </>
    )
}