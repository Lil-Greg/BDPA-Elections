import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function VotingPage() {
    const { userId } = useParams();
    return <>
        <Container>
            {userId}
        </Container>
    </>
}