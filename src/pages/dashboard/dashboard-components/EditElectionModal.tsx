import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { UseUnfilteredElection } from "../../../hooks/useElection";
import { useRef } from "react";

type EditElectionModal = {
    show: boolean,
    handleClose: () => void,
    election_id: string,
}
export default function EditElectionsModal({ show, handleClose, election_id }: EditElectionModal) {
    const { elections } = UseUnfilteredElection();
    if (!elections) {
        console.warn("Shit is not Working...")
        show = false;
        return;
    }
    const data = elections.filter(election => election.election_id === election_id);
    const election = data[0];

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
            <Form>
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