import { useMutation, useQuery } from "convex/react";
import { Button, Col, FloatingLabel, Form, InputGroup, Row } from "react-bootstrap";
import { api } from "../../../../convex/_generated/api";
import React, { useContext, useRef, useState } from "react";
import UseElection from "../../../hooks/useElection";
import UserContext from "../../../context/UserContext";
import { Election, User } from "../../../type";
import { useNavigate } from "react-router-dom";
import useElectionHistory from "../../../hooks/useElectionHistory";

export default function AssignPage() {
    const { user } = useContext(UserContext);
    if (!user) {
        throw Error('Not Logged In');
    }
    const savedUserData = useQuery(api.users.getSingleUser, { username: user.username });
    const everyUser = useQuery(api.users.get);
    const { elections, isLoading, isErroring } = UseElection();
    const { electionsH } = useElectionHistory();
    const newElectionAssignment = useMutation(api.users.assignUserElection);
    const newRoleAssignment = useMutation(api.users.changeType);
    const navigate = useNavigate();

    const assignmentRef = useRef<HTMLSelectElement>(null);
    const searchUserRef = useRef<HTMLSelectElement>(null);
    const selectAssignmentPurpose = useRef<HTMLSelectElement>(null);
    const roleRef = useRef<HTMLSelectElement>(null);

    const [electionError, setElectionError] = useState<0 | 1 | 2 | false>(false);
    const errorMessages = ['Election Does Not Exist', 'User is Already Assigned This Election', 'You Cannot Assign Elections'];
    const [userValid, setUserValid] = useState(false);
    const [userError, setUserError] = useState(false);
    const [assignUser, setAssignUser] = useState<User | undefined>(undefined);

    const [assignElection, setAssignElection] = useState(false);
    const [assignRole, setAssignRole] = useState(false);

    if (isLoading) {
        return <>
            Loading...
        </>
    }
    if (isErroring) {
        return <>
            Something Went Wrong!
        </>
    }
    function userDataList(): User[] | undefined {
        const filterUsersByType = everyUser?.filter((userData) => {
            if (user?.type === 'super') {
                return userData.type !== 'super';
            };
            if (user?.type === 'administrator') {
                return (
                    userData.type !== 'super'
                    && userData.type !== 'administrator'
                )
            };
            if (user?.type === 'moderator') {
                return (
                    userData.type !== 'super'
                    && userData.type !== 'administrator'
                    && userData.type !== 'moderator'
                )
            };
        });
        return filterUsersByType;
    };
    const electionsDataList = (): Election[] | undefined => {
        if (!electionsH) {
            throw Error("Elections History is Undefined");
        }
        const filterWithHistory = user?.assignedElections ? electionsH.filter(electionD => {
            if (user?.type === 'moderator') {
                if (!user.assignedElections) {
                    setElectionError(2);
                    return false;
                }
                return user.assignedElections.includes(electionD.election_id) && Date.now() > electionD.closesAt && electionD.owned;
            }
            return Date.now() > electionD.closesAt && electionD.owned === true;
        }) : undefined;

        if (!elections) {
            throw Error("There Are No Elections");
        }
        const filterElecReg = elections.filter(electionD => {
            if (user?.type === 'moderator') {
                return user.assignedElections?.includes(electionD.election_id) && electionD.owned;
            }
            return electionD.owned === true;
        });
        // TO-DO: Combine the filters
        /*const assignUserIsMod = ;
        if (assignUser?.type === "moderator") {
            return assignUserIsMod;
        }*/
        if (assignUser?.type === "reporter") {
            return filterWithHistory;
        }

        return filterElecReg;
    };
    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const checkValidUsername: User[] | undefined = everyUser?.filter(userData => userData.username === event.currentTarget.value);

        if (checkValidUsername) {
            if (checkValidUsername?.length === 0) {
                setUserError(true);
                setUserValid(false);
                setAssignUser(undefined);
            } else {
                setUserError(false);
                setUserValid(true);
                setAssignUser(checkValidUsername[0]);
            }
        }
    };

    const handleSelectOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value === "roles") {
            setAssignElection(false);
            setAssignRole(true);
        } else if (event.currentTarget.value === "elections") {
            setElectionError(false);
            setAssignRole(false);
            setAssignElection(true);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        // TO-DO: Add A History Check and Assignment
        event.preventDefault();
        const assignment = assignmentRef.current?.value;
        const electionCheck = elections?.filter((election) => election.title === assignment);
        const assignmentIds = electionCheck?.map(election => election.election_id);

        if (assignElection === true) {
            // TO-Do: Not Correctly Displaying
            const checkUserAssignments = electionCheck?.filter(election => {
                return assignUser?.assignedElections?.includes(election.election_id);
            });
            console.log(checkUserAssignments);
            if (assignmentRef && electionCheck && electionCheck.length > 0 && assignUser && assignmentIds && checkUserAssignments && checkUserAssignments.length === 0) {
                savedUserData;
                await newElectionAssignment({ id: assignUser._id, assignedElection: assignmentIds });
                navigate('/', { replace: true });
            } else if (electionCheck?.length === 0) {
                setElectionError(0);
            } else if (checkUserAssignments && checkUserAssignments.length > 0) {
                setElectionError(1);
            };
            if (!user?.assignedElections) {
                savedUserData;
            };
        };
        if (assignRole === true) {
            if (assignUser && roleRef !== null && roleRef.current !== null) {
                console.log(roleRef.current.value)
                await newRoleAssignment({ id: assignUser._id, type: roleRef.current.value });
                navigate('/', { replace: true });
            }
        }
    };
    return (
        <>
            <Row className="mb-3">
                <Col>
                    <InputGroup>
                        <FloatingLabel
                            controlId="floatingInputSearchUser"
                            label="User To Assign"
                        >
                            <Form.Select
                                ref={searchUserRef}
                                onChange={handleOnChange}
                                isInvalid={userError}
                                isValid={userValid}
                                defaultValue='none'
                                style={{ borderRadius: '10px' }}
                            >
                                <option value="none" disabled>Assign A Voter</option>
                                {userDataList() !== undefined ? userDataList()?.map((userData, index) => <option
                                    style={{ fontWeight: '600' }}
                                    key={index}
                                    value={userData.username}
                                >
                                    {userData.username}:&nbsp;{userData.type}
                                </option>) : (
                                    <option>Cannot Assign With No Users</option>
                                )}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">No User That Matches This Username</Form.Control.Feedback>
                            <Form.Control.Feedback type='valid' />
                        </FloatingLabel>
                    </InputGroup>
                </Col>

                <Col>
                    <Form.Select
                        ref={selectAssignmentPurpose}
                        defaultValue='none'
                        style={{ height: '58px' }}
                        onChange={handleSelectOnChange}
                    >
                        <option value='none' disabled>Put In A User</option>
                        <option value="elections" style={{ fontWeight: "600" }}>Assign Election</option>
                        <option value="roles" style={{ fontWeight: "600" }}>Assign New Roles</option>
                    </Form.Select>
                </Col>
            </Row>

            <Form onSubmit={handleSubmit}>
                {assignElection ? (
                    <>
                        <InputGroup
                            className="mb-3"
                        >
                            <Form.Select
                                ref={assignmentRef}
                                style={{ height: '58px' }}
                                isInvalid={electionError === false ? false : true}
                                defaultValue='none'
                            >
                                <option value="none" disabled>Assign {assignUser?.username} To An Election</option>
                                {electionsDataList()?.length === 0 ? (
                                    <option value="error" disabled>You Cannot Assign Users because You Are Not Assigned Any Election</option>
                                ) : electionsDataList()?.map(election => <option value={election.title} style={{ fontWeight: "600" }} key={election.title}>
                                    {election.title}:&nbsp;
                                    Type:&nbsp;{election.type === 'irv' ? "Instant-Runoff Method" : "Copeland Method"}
                                </option>)
                                }
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {electionError !== false && errorMessages[electionError]}
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Button type="submit" variant={
                            electionError ? 'danger' : userError ? 'danger'
                                : userValid ? 'success'
                                    : 'danger'
                        }>Assign</Button>
                    </>
                ) : assignRole && (
                    <>
                        <Form.Select ref={roleRef} defaultValue="none" style={{ height: '58px' }}>
                            <option value="none" disabled>Assign A Role</option>
                            <option value="voter" style={{ fontWeight: "600" }}>Voter</option>
                            <option value="reporter" style={{ fontWeight: "600" }}>Reporter</option>
                            {user?.type === "administrator" ? (
                                <option value="moderator" style={{ fontWeight: "600" }}>Moderator</option>
                            ) : user?.type === "super" && (
                                <option value="administrator" style={{ fontWeight: "600" }}>Administrator</option>
                            )}
                        </Form.Select>

                        <Button
                            type="submit"
                            variant={
                                electionError ? 'danger' : userError ? 'danger'
                                    : userValid ? 'success'
                                        : 'danger'
                            }
                            className="mt-3"
                        >Assign</Button>
                    </>
                )}
            </Form>
        </>
    )
}