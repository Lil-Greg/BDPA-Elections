import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import getAllElections from "../../../hooks/useElection";

type EditElectionModal = {
    show: boolean,
    handleClose: () => void,
    election_id: string,
}
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
    const coolest = elections.filter(election => election.election_id === election_id);
    const election = coolest[0];

    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const handleDeleteElection = () => {
        //Delete Election
    }
    const handleEditElection = () => {
        //Edit Election
    }
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Editing:&nbsp;<span style={{ textDecoration: "underline" }}>{election.title} Election</span> </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form className="d-flex justify-content-center">
                <FloatingLabel controlId="floatingLabelEditTitle" label="Title">
                    <Form.Control
                        placeholder="Title"
                        isInvalid={false}
                        defaultValue={election.title}
                        ref={titleRef}
                    />
                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel controlId="floatingLabelEditDesc" label="Description">
                    <Form.Control
                        as="textarea"
                        placeholder="Description"
                        isInvalid={false}
                        defaultValue={election.description}
                        ref={descriptionRef}
                    />
                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </FloatingLabel>
            </Form>
        </Modal.Body>
        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="danger" onClick={handleDeleteElection}>
                Delete
            </Button>
            <Button variant="primary" onClick={handleEditElection}>
                Save Edit
            </Button>
        </Modal.Footer>
    </Modal>
}