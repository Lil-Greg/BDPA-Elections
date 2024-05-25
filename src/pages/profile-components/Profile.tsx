import { useContext } from "react"
import UserContext from "../../context/UserContext"
import getImageURL from "../../utils/image-util";
import { Container } from "react-bootstrap";

export default function Profile() {
    const { user } = useContext(UserContext);
    return (
        <>
            <Container>
                <img src={getImageURL("default-pfp.jpg")} alt="User Profile Picture" />
                {user?.username}
            </Container>
        </>
    )
}