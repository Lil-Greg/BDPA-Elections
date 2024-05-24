import { Button, Container, FloatingLabel, Form, Modal } from "react-bootstrap";
import { CreateElection } from "../type";
import { useRef, useState } from "react";
import AdminCreateElection from "../hooks/useCreateElection";

export default function CreateElectionPage() {
    const [continueForm, setContinueForm] = useState<boolean | null>(null);
    const [election, setElection] = useState<CreateElection | null>();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const titleRef = useRef<HTMLInputElement>(null);
    const [formValues, setFormValues] = useState({
        /*use a useRef to set formValues, have to set all at once.*/
        title: '',
        description: '',
        options: [],
        opensAt: 0,
        closesAt: 0,

    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setShow(!show);
        if (continueForm === true) {
            setElection(await AdminCreateElection(formValues));
            setShow(!show);
        } else {
            return;
        }
    }
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* FORM */}
            <Container>
                <h1>Create An Election</h1>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Title"
                        className='mb-3 w-50'
                    >
                        <Form.Control autoComplete="off" type="text" ref={titleRef} placeholder="Election Title" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Username"
                        className='mb-3 w-50'
                    >
                        <Form.Control autoComplete="off" type="text" placeholder="Username" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Username"
                        className='mb-3 w-50'
                    >
                        <Form.Control autoComplete="off" type="text" placeholder="Username" />
                    </FloatingLabel>
                    <Button variant="primary" onClick={handleShow}>
                        Submit Form
                    </Button>
                </Form>
            </Container>
        </>
    )
}