import './CreateElectionStyle.css';
import { Button, Col, Container, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import { CreateElection } from "../../type";
import { useRef, useState } from "react";
import AdminCreateElection from "../../hooks/useCreateElection";
import { useNavigate } from "react-router-dom";

export default function CreateElectionPage() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [error, setError] = useState(false);
    const [formValues, setFormValues] = useState<CreateElection>({
        /*use a useRef to set formValues, have to set all at once.*/
        title: '',
        type: 'irv' || 'cpl',
        description: '',
        options: [],
        opensAt: 0,
        closesAt: 0,

    });
    const titleRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const optionsRef = useRef<HTMLInputElement>(null);
    const opensAtRef = useRef<HTMLInputElement>(null);
    const closesAtRef = useRef<HTMLInputElement>(null);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        switch (error) {
            case (true):
                setShow(false)
                break;
            case (false):
                setShow(true);
                break;
        }
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const titleValue = titleRef.current?.value;
        const typeValue = typeRef.current?.value;
        const descriptionValue = descriptionRef.current?.value;
        const optionsValue = optionsRef.current?.value;
        const opensAtValue = opensAtRef.current?.value;
        const closesAtValue = closesAtRef.current?.value;

        if (titleValue && descriptionValue && optionsValue && opensAtValue && closesAtValue && typeValue && typeValue !== 'none') {
            const x = parseInt(opensAtValue);
            const y = parseInt(closesAtValue);
            setFormValues({
                title: titleValue,
                type: typeValue,
                description: descriptionValue,
                options: [optionsValue],
                opensAt: x,
                closesAt: y,
            });
            setError(false)
        } else {
            setError(true);
            setShow(false);
            alert("Enter A Value!")
        }
    }

    const handleActualSubmit = () => {
        AdminCreateElection(formValues);
        navigate('/elections', { replace: true })
    }
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Are You Sure You Want To SUBMIT?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Although you can edit your election, you cannot add more options.
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleActualSubmit}>
                        Create Election
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* FORM */}
            <Container className="create-election-container">
                <h1>Create An Election</h1>
                <Form className='create-election-form' onSubmit={handleFormSubmit}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Title"
                        className='mb-3 w-50'
                    >
                        <Form.Control autoComplete="off" type="text" ref={titleRef} placeholder="Title" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Description"
                        className='mb-3 w-50'
                    >
                        <Form.Control autoComplete="off" type="text" as='textarea' ref={descriptionRef} placeholder="Description" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Options"
                        className='mb-3 w-50'
                    >
                        <Form.Control autoComplete="off" type="text" ref={optionsRef} placeholder="Options" />
                    </FloatingLabel>
                    <Form.Select defaultValue='none' ref={typeRef}>
                        <option value="none">Select A Type...</option>
                        <option value='irv'>Instant-Runoff Voting Method</option>
                        <option value='cpl'>Copeland Voting Method</option>
                    </Form.Select>
                    <Row>
                        <Col style={{ marginTop: '1rem' }}>
                            <p style={{ lineHeight: '0.25rem' }}>Opens At</p>
                            <Form.Control ref={opensAtRef} type="date" />
                        </Col>
                        <Col style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                            <p style={{ lineHeight: '0.25rem' }}>Closes At</p>
                            <Form.Control ref={closesAtRef} type="date" />
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit" onClick={handleShow}>
                        Submit Form
                    </Button>
                </Form>
            </Container>
        </>
    )
}