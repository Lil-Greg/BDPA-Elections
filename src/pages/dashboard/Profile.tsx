import { useContext } from "react"
import UserContext from "../../context/UserContext"
import { Col, Container, Row } from "react-bootstrap";

export default function Profile() {
    const { user } = useContext(UserContext);
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
            </Container>
        </>
    )
}