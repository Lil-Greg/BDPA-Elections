import { useContext, useState } from "react"
import UserContext from "../../context/UserContext"
import { Container } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";

export default function Settings() {
    const { user } = useContext(UserContext);
    const [editPassword, setEditPassword] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState(user?.email);


    function handleTogglePassword() {
        setEditPassword(!editPassword);
    }

    function handleToggleEmail() {
        setEditEmail(!editEmail);
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>, toggleEdit: () => void) {
        if (e.key === "Enter") {
            toggleEdit();
        }
    }

    return <>
        <Container>
            <div className="editableElements">Password: {editPassword ? (
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setEditPassword(false)}  // Save and exit edit mode when input loses focus
                    onKeyUp={(e) => handleKeyPress(e, () => setEditPassword(false))}
                />
            ) : (
                <span>{password} <BsPencilSquare onClick={handleTogglePassword} /></span>
            )}
            </div>
            <div className="editableElements">Email: {editEmail ? (
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEditEmail(false)}  // Save and exit edit mode when input loses focus
                    onKeyUp={(e) => handleKeyPress(e, () => setEditEmail(false))}
                />
            ) : (
                <span>{email} <BsPencilSquare onClick={handleToggleEmail} /></span>
            )}
            </div>
        </Container>
    </>
}