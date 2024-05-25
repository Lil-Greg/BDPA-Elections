import { useContext } from "react"
import UserContext from "../context/UserContext"
import getImageURL from "../utils/image-util";
import { Col, Container, Row } from "react-bootstrap";


export default function DashboardPage() {
    const { user } = useContext(UserContext);
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <img src={getImageURL("default-pfp.jpg")} alt="User Profile Picture" />
                        {user && user.type && user.username}
                    </Col>
                </Row>
            </Container>
        </>
    )
}