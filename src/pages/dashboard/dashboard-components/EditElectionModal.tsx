import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getAllElections, { useDeleteElection } from "../../../hooks/useElection";
import { EditElection } from "../../../type";

type EditElectionModal = {
    show: boolean,
    handleClose: () => void,
    election_id: string,
}
// Do Super user and admin filter in AdminElections page.
export default function EditElectionsModal({ show, handleClose, election_id }: EditElectionModal) {
    const { data } = useQuery({
        queryKey: ["GetAllElections"],
        queryFn: () => getAllElections(),
    });
    const elections = data;
    if (!elections) {
        console.warn("Shit is not Working...")
        show = false;
        return;
    }

    const [deleteElection, setDeleteElection] = useState(false);

    const filter = elections.filter(election => election.election_id === election_id);
    const election = filter[0];

    const [formValues, setFormValues] = useState<EditElection>();
    const [titleState, setTitleState] = useState<string>(election.title);
    const [descState, setDescState] = useState<string>(election.description);
    const options: string[] = election.options.map(option => option);
    const typeRef = useRef<HTMLSelectElement>(null);
    /*
        0 & 1 is Title
        2 & 3 is Description
        4 & 5 is Options
        6 is Type
    */
    const [allError, setAllError] = useState<false | number>(false);
    const errorMessage = ["Title Already Exists", "No Title",
        "Description Already Exists", "No Description",
        "Option Already Exists", "No Option",
        "Error On Select For Some Reason, lol"
    ];

    const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const filteredChange = elections.filter(val => val.title === value && val.election_id !== election_id);

        if (filteredChange.length > 0) {
            setAllError(0);
        } else if (value.length === 0) {
            setAllError(1);
        } else {
            setAllError(false);
        }

        if (allError === false) {
            setTitleState(value);
        }
    };
    const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const filteredChange = elections.filter(val => val.description === value && val.election_id !== election_id);

        if (filteredChange.length > 0) {
            setAllError(2);
        } else if (value.length === 0) {
            setAllError(3);
        } else {
            setAllError(false);
        }

        if (allError === false) {
            setDescState(value);
        }
    };
    const onOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const filteredChange = options.filter(option => option === value);

        if (filteredChange.length > 0) {
            setAllError(4);
        } else if (value.length === 0) {
            setAllError(5);
        } else {
            setAllError(false);
        }

        if (allError === false) {
            options.push(value);
        }
    };

    const handleDeleteElection = async () => {
        setDeleteElection(true);
        if (deleteElection) {
            const deleted = await useDeleteElection(election_id);
            console.log(deleted, election.deleted);
        }
    }
    const handleEditElection = () => {
        titleState.length === 0 ? setAllError(1)
            : descState.length === 0 ? setAllError(3)
                : options.length === 0 ? setAllError(5)
                    : typeRef === null ? setAllError(6)
                        : setAllError(false);

        if (allError === false) {
            setFormValues({
                title: titleState,
                description: descState,
                type: typeRef.current?.value || "irv",
                options: options,
                opensAt: 0,
                closesAt: 0,
            });
            // Edit Elections with FormValues as Param
        }
    }
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Editing:&nbsp;<span style={{ textDecoration: "underline" }}>{election.title}</span> </Modal.Title>
        </Modal.Header>
        <Form className="grid m-2 row-gap-2">
            <Modal.Body className="grid column-gap:2;">
                <FloatingLabel controlId="floatingLabelEditTitle" label="Title" className="col-12">
                    <Form.Control
                        placeholder="Title"
                        isInvalid={allError === 0 || allError === 1 ? true : false}
                        defaultValue={election.title}
                        onChange={onTitleChange}
                    />
                    <Form.Control.Feedback type="invalid">{allError !== false && errorMessage[allError]}</Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel controlId="floatingLabelEditDesc" label="Description" className="col-12">
                    <Form.Control
                        as="textarea"
                        placeholder="Description"
                        isInvalid={allError === 2 || allError === 3 ? true : false}
                        defaultValue={election.description}
                        onChange={onDescriptionChange}
                    />
                    <Form.Control.Feedback type="invalid">{allError !== false && errorMessage[allError]}</Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel controlId="floatingLabelEditOption" label="Options" className="col-12">
                    <Form.Control
                        as="textarea"
                        placeholder="Options"
                        isInvalid={allError === 4 || allError === 5 ? true : false}
                        defaultValue={options.map(option => option)}
                        onChange={onOptionsChange}
                    />
                    <Form.Control.Feedback type="invalid">{allError !== false && errorMessage[allError]}</Form.Control.Feedback>
                </FloatingLabel>
                <Form.Select isInvalid={allError === 6 ? true : false} defaultValue={election.type} ref={typeRef}>
                    <option value="irv">Instant Runoff Method</option>
                    <option value="cpl">Copeland Method</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{allError === 6 && errorMessage[allError]}</Form.Control.Feedback>
            </Modal.Body>

            <Button variant="danger" onClick={handleDeleteElection} className="col-6">
                Delete
            </Button>
            <Button variant="primary" onClick={handleEditElection} className="col-6">
                Save Edit
            </Button>
        </Form>
    </Modal>
}