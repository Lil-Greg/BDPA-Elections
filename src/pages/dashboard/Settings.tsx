import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext"
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Settings() {
    const { user } = useContext(UserContext);
    const deleteAccount = useMutation(api.users.deleteUser);
    const navigate = useNavigate();

    const [logOutShow, setLogOutShow] = useState(false);
    const [deleteAccountShow, setDeleteAccountShow] = useState(false);

    const handleDAClose = () => setDeleteAccountShow(false);
    const handleLOClose = () => setLogOutShow(false);

    const handleLogOutClick = () => {
        setLogOutShow(true);
    }
    const handleLogOut = () => {
        localStorage.removeItem('election-user');
        window.location.reload();
    }
    const handleDeleteClick = () => {
        setDeleteAccountShow(true);
    }
    const handleDeleteAccount = () => {
        if (user && user._id !== null || user && user._id !== undefined) {
            deleteAccount({ id: user._id });
            localStorage.removeItem('election-user');
            navigate('/login');
        }
    }
    return <>
        <Container>
            <Modal show={logOutShow} onHide={handleLOClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Are your sure you want to Log Out?</Modal.Title>
                </Modal.Header>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="secondary" onClick={handleLOClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleLogOut}>
                        Log Out
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={deleteAccountShow} onHide={handleDAClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete your account?</Modal.Title>
                </Modal.Header>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="secondary" onClick={handleDAClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* CARD */}
            <Card className="settings-danger-zone">
                <Card.Title style={{ color: '#dc3545', textDecoration: 'underline #dc3545' }}>Danger Zone</Card.Title>
                <Card.Body>
                    <Row className="mb-2">
                        <Col>
                            <Button type="button" variant="danger" onClick={handleLogOutClick}>Log Out</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="button" variant="danger" onClick={handleDeleteClick}>Delete Account</Button>
                        </Col>
                    </Row>
                </Card.Body>

            </Card>
        </Container>
    </>
}