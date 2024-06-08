import { useContext, useState } from "react"
import UserContext from "../../context/UserContext"
import { Col, Container, Row } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";

export default function Profile() {
    const { user } = useContext(UserContext);
    const [editUsername, setEditUsername] = useState(false);
    const [username, setUsername] = useState(user?.username);

    function handleToggleUsername() {
        setEditUsername(!editUsername);
        if (editUsername == true) {
            editUsername
        }
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>, toggleEdit: () => void) {
        if (e.key === "Enter") {
            toggleEdit();
        }
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p className="dashboard-firstName">First Name:&nbsp;{user?.firstName}</p>
                    </Col>
                    <Col>
                        <p className="dashboard-lastName">Last Name:&nbsp;{user?.lastName}</p>
                    </Col>
                </Row>
                <div className="editableElements">Username: {editUsername ? (
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => setEditUsername(false)}  // Save and exit edit mode when input loses focus
                        onKeyDown={(e) => handleKeyPress(e, () => setEditUsername(false))}
                    />
                ) : (
                    <span>{username} <BsPencilSquare onClick={handleToggleUsername} /></span>
                )}
                </div>
            </Container>
        </>
    )
}