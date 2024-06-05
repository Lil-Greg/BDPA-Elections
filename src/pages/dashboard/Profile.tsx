import { useContext, useState } from "react"
import UserContext from "../../context/UserContext"
import getImageURL from "../../utils/image-util";
import { Container } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";

export default function Profile() {
    const { user } = useContext(UserContext);
    const [editUsername, setEditUsername] = useState(false);
    const [username, setUsername] = useState(user?.username);

    function handleToggleUsername() {
        setEditUsername(!editUsername);
        if(editUsername == true){

        }
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>, toggleEdit: () => void){
        if(e.key === "Enter"){
            toggleEdit();
        }
    }

    return (
        <>
            <Container>
                <img src={getImageURL("default-pfp.jpg")} alt="User Profile Picture" />
                <div className="editableElements">Username: {editUsername ? (
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        onBlur={() => setEditUsername(false)}  // Save and exit edit mode when input loses focus
                        onKeyPress={(e) => handleKeyPress(e, () => setEditUsername(false))}
                    />
                ) : (
                    <span>{username} <BsPencilSquare onClick={handleToggleUsername} /></span>
                )}
            </div>
            </Container>
        </>
    )
}