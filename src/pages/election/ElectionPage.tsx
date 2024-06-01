import './ElectionPage.css';
import { useParams } from "react-router-dom";
import { UseSingleElection } from "../../hooks/useElection"
import { Election } from "../../type";
// import IRVElections from "../../components/IRV-Elections";
import { Card, Col, Container, Row } from "react-bootstrap";

export default function ElectionPage() {
    const { electionId } = useParams();
    const election: Election | undefined = UseSingleElection(electionId || '');

    // Rendering error comes from IRVElections
    // if (document.readyState) { IRVElections(electionId || ""); }


    return (
        <>
            <Container className="electionPage-container">
                <Card className="electionPage-jumboCard">
                    <h1 className="electionPage-title">{election?.title}</h1>
                    <h5 className="electionPage-description">{election?.description}</h5>
                    <Row>
                        <Col>
                            <p className='electionPage-openingDate electionPage-Dates'>{election?.opensAt && new Date(election.opensAt).toString()}</p>
                        </Col>
                        <Col>
                            <p className='electionPage-closingDate electionPage-Dates'>{election?.closesAt && new Date(election.closesAt).toString()}</p>
                        </Col>
                    </Row>
                </Card>
                <div className='options-overlap-div'>
                    {election?.options.map((options, index) => {
                        return (
                            <>
                                <p className={`every-option option-number-${index}`}>{options}</p>&nbsp;&nbsp;
                            </>
                        )
                    })}
                </div>

            </Container>
        </>
    )
}