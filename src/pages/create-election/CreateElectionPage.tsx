import './CreateElectionStyle.css';
import { Button, Col, Container, FloatingLabel, Form, InputGroup, ListGroup, ListGroupItem, Modal, Row } from "react-bootstrap";
import { CreateElection } from "../../type";
import { useRef, useState } from "react";
import AdminCreateElection from "../../hooks/useCreateElection";
import { useNavigate } from "react-router-dom";
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { IoCloseCircle, IoCloseCircleOutline } from "react-icons/io5";
import UseElection from '../../hooks/useElection';

export default function CreateElectionPage() {
    const { elections } = UseElection();
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

    const [show2, setShow2] = useState(false);
    const [optionSameName, setOptionSameName] = useState(false);
    const [noOptions, setNoOptions] = useState(false);
    const [titleSameName, setTitleSameName] = useState(false);
    const [optionsArray, setOptionsArray] = useState<string[]>([]);

    const handleClose = () => { setShow(false); setShow2(false); };
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
    const handleCheckOption = () => {
        const optionsValue = optionsRef.current?.value;
        if (optionsValue !== undefined) {
            const checking = optionsArray.filter((option) => optionsValue === option);
            checking[0] === optionsValue ? setOptionSameName(true) : setOptionSameName(false);
        }
    };
    const handleAddNewOption = () => {
        if (optionsRef.current?.value !== undefined) {
            const optionValue = optionsRef.current.value;
            // optionsArray.find((value) => value === optionValue ? setOptionSameName(true) : setOptionSameName(false));
            switch (optionSameName) {
                case (false):
                    optionsArray.push(optionValue);
                    setOptionsArray(optionsArray);
                    optionsRef.current.value = '';
                    break;
            }
        }
    };
    const handleShow2 = () => {
        switch (optionSameName) {
            case (true):
                setShow2(false)
                break;
            case (false):
                setShow2(true);
                break;
        }
    }

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const titleValue = titleRef.current?.value;
        const typeValue = typeRef.current?.value;
        const descriptionValue = descriptionRef.current?.value;
        const opensAtValue = opensAtRef.current?.value || '';
        const closesAtValue = closesAtRef.current?.value || '';

        const openingDate = new Date(opensAtValue).setMilliseconds(parseInt(opensAtValue));
        const closingDate = new Date(closesAtValue).setMilliseconds(parseInt(closesAtValue));
        const opensAtLessThanOrEqualToCloses = openingDate <= closingDate ? true : false;

        const checkingSameTitle = elections?.filter((oneElection) => oneElection.title.toLowerCase() === titleValue?.toLowerCase());
        if (titleValue && descriptionValue && optionsArray && opensAtValue && closesAtValue && typeValue && typeValue !== undefined && optionsArray.length !== 0 && opensAtLessThanOrEqualToCloses === true) {
            setFormValues({
                title: titleValue,
                type: typeValue,
                description: descriptionValue,
                options: optionsArray,
                opensAt: openingDate,
                closesAt: closingDate,
            });
            setError(false);
            setNoOptions(false);
        } else if (optionsArray.length === 0) {
            setNoOptions(true);
            setError(true);
            setShow(false);
        } else if (checkingSameTitle && checkingSameTitle.length > 0) {
            setTitleSameName(true);
            setError(true);
            setShow(false);
        } else if (opensAtLessThanOrEqualToCloses === false) {
            alert('Opening value is greater than closing value.');
            setError(true);
            setShow(false);
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

            {/* Options Modal */}
            <Modal show={show2} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Current Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {optionsArray.map((option, index) => {
                            const removed = optionsArray[index] === option ? false : true;
                            const evenOrOdd = index % 2 === 0 ? 'even' : 'odd';
                            return <>
                                <ListGroupItem
                                    key={index}
                                    style={{ display: 'flex', alignItems: "", justifyContent: 'space-between' }}
                                    className={removed ? 'removed-option' : evenOrOdd === 'even' ? 'even-option' : 'odd-option'}
                                >
                                    {index + 1}.&nbsp;{option}
                                    <IoCloseCircleOutline key={index} size={'1.5rem'} className='create-election-delete-option'
                                        onClick={() => {
                                            optionsArray.splice(index, 1);
                                            setOptionsArray(optionsArray);
                                        }}
                                        onMouseOver={() => <IoCloseCircle />} />
                                </ListGroupItem>
                            </>
                        })}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
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
                        <Form.Control autoComplete="off" type="text" ref={titleRef} placeholder="Title" isInvalid={titleSameName} />
                        <Form.Control.Feedback type='invalid'>Already an Election with the Same Name</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Description"
                        className='mb-3 w-50'
                    >
                        <Form.Control autoComplete="off" type="text" as='textarea' ref={descriptionRef} placeholder="Description" />
                    </FloatingLabel>
                    <InputGroup className='mb-1 w-50'>
                        <FloatingLabel
                            controlId="floatingInputOptions"
                            label="Options"
                        >
                            <Form.Control
                                className='create-election-options-input'
                                autoComplete="off"
                                type="text"
                                ref={optionsRef}
                                onChange={handleCheckOption}
                                isInvalid={optionSameName ? optionSameName : noOptions}
                                placeholder="Options"
                                spellCheck={true}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {optionSameName === true ? 'Options Cannot Have The Same Name'
                                    : noOptions === true && 'There Are No Options to Submit'}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                        {optionSameName === false && noOptions === false && (<InputGroupText onClick={handleAddNewOption} className='create-election-option-input-group-text'>+</InputGroupText>)}
                    </InputGroup>
                    <Button className='mb-2' variant={optionSameName ? 'danger' : 'success'} onClick={handleShow2}>See Options</Button>
                    <Form.Select defaultValue='none' className='mb-3 w-50 create-election-type-selection' ref={typeRef}>
                        <option value="none">Select A Type...</option>
                        <option value='irv'>Instant-Runoff Voting Method (IRV)</option>
                        <option value='cpl'>Copeland Voting Method (CPL)</option>
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