import { useMutation, useQuery } from "convex/react";
import { Button, FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { api } from "../../../../convex/_generated/api";
import React, { useContext, useRef, useState } from "react";
import UseElection from "../../../hooks/useElection";
import UserContext from "../../../context/UserContext";
import { User } from "../../../type";

export default function AssignPage() {
    const { user } = useContext(UserContext);
    const savedUserData = useQuery(api.users.getSingleUser, { username: user ? user?.username : '' });
    const everyUser = useQuery(api.users.get);
    const { elections, isLoading, isErroring } = UseElection();
    const newAssignment = useMutation(api.users.assignUserElection);

    const assignmentRef = useRef<HTMLInputElement>(null);
    const searchUserRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<0 | 1 | false>(false);
    const errorMessages = ['Election Does Not Exist', 'User is Already Assigned This Election'];
    const [userValid, setUserValid] = useState(false);
    const [userError, setUserError] = useState(false);
    const [assignUser, setAssignUser] = useState<User | undefined>(undefined);

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

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checkValidUsername = everyUser?.filter(userData => userData.username === event.currentTarget.value);

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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(assignUser);
        const assignment = assignmentRef.current?.value;
        const electionCheck = elections?.filter((election) => election.title === assignment);
        const assignmentIds = electionCheck?.map(election => election.election_id);

        if (assignmentRef && electionCheck && electionCheck.length > 0 && user && assignmentIds) {
            console.log(electionCheck);
            console.log("Assigned Elections Ids", assignmentIds);
            savedUserData
            await newAssignment({ id: user._id, assignedElection: assignmentIds });
        } else if (electionCheck?.length === 0) {
            setError(0);
        }
        if (!user?.assignedElections) {
            savedUserData
        }
    }
    return (
        <>
            <InputGroup>
                <FloatingLabel
                    controlId="floatingInputSearchUser"
                    label="User To Assign"
                >
                    <Form.Control
                        ref={searchUserRef}
                        list="userList"
                        placeholder="User To Assign"
                        onChange={handleOnChange}
                        isInvalid={userError}
                        isValid={userValid}
                        autoComplete='off'
                    />
                    <Form.Control.Feedback type="invalid">No User That Matches This Username</Form.Control.Feedback>
                    <Form.Control.Feedback type='valid' />
                </FloatingLabel>
                <datalist id="userList">
                    {everyUser?.map((userData, index) => <option key={index} value={userData.username}>
                        {userData.username}
                    </option>)}
                </datalist>
            </InputGroup>
            <Form onSubmit={handleSubmit}>
                <InputGroup
                    className="mb-3"
                >
                    <FloatingLabel
                        controlId="floatingInputAssignment"
                        label="Assign To Election"
                    >
                        <Form.Control
                            ref={assignmentRef}
                            placeholder="Assign To Election"
                            list="assignmentList"
                            isInvalid={error !== false ? true : false}
                        />
                        <Form.Control.Feedback type="invalid">
                            {error !== false && errorMessages[error]}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <datalist id="assignmentList">
                        {elections?.map((election, index) => <option key={index} value={election.title}>
                            {election.title}
                        </option>)}
                    </datalist>
                </InputGroup>
                <Button type="submit" variant={
                    error ? 'danger' : userError ? 'danger' : ''
                }>Assign</Button>
            </Form>
        </>
    )
}