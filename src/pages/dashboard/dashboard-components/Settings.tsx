import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext"
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

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
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login', { replace: true });
        window.location.reload();
    }
    const handleDeleteClick = () => {
        setDeleteAccountShow(true);
    }
    const handleDeleteAccount = () => {
        if (user && user._id !== null || user && user._id !== undefined) {
            deleteAccount({ id: user._id });
            localStorage.clear();
            sessionStorage.clear();
            navigate('/login', { replace: true });
            window.location.reload();
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
            <Container className={user?.type === 'administrator' || user?.type === 'super' ? "settings-card-container" : ''}>
                {user?.type === 'administrator' ? (
                    <Card className="settings-card-register mb-2 settings-card">
                        <Card.Title className="settings-card-title">
                            Create A Moderator
                        </Card.Title>
                        <Card.Body className="settings-card-body">
                            <Button onClick={() => navigate('/register')} className="settings-register-button">Register</Button>
                        </Card.Body>
                    </Card>
                ) : user?.type === 'super' && (
                    <Card className="settings-card-register mb-2 settings-card">
                        <Card.Title className="settings-card-title">
                            Create An Administrator
                        </Card.Title>
                        <Card.Body className="settings-card-body">
                            <Button onClick={() => navigate('/register')} className="settings-register-button">Register</Button>
                        </Card.Body>
                    </Card>
                    
                )}
                    <Card className="settings-card-maintenance mb-2 settings-card">
                        <Card.Title className="settings-card-title-maintenance">
                            Enter Maintenance Mode
                        </Card.Title>
                        <Card.Body className="settings-card-body">
                            <Button variant="success"onClick={() => navigate('/maintenance')} className="settings-maintenance-button">
                                Activate
                            </Button>
                        </Card.Body>
                    </Card>

                <Card className="settings-danger-zone settings-card">
                    <Card.Title style={{ fontSize: '2rem', fontWeight: '500', color: '#dc3545', textDecoration: 'underline #dc3545' }}>Danger Zone</Card.Title>
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
        </Container>
    </>
}