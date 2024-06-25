import { Accordion } from 'react-bootstrap';
import useElectionHistory from '../../hooks/useElectionHistory';
import './HistoryPage.css';

export default function HistoryPage() {
    const { elections, isLoading, isErroring } = useElectionHistory();
    if (isLoading) {
        return <>
            Loading...
        </>
    }
    if (isErroring) {
        return <>
            Something Went Wrong!
        </>
    }
    elections?.elections.map((electionInfo) => electionInfo.owned && console.log(electionInfo.title, electionInfo.deleted));
    return <>
        <Accordion>
            {elections && elections.elections.map((electionInfo, index) => <>
                {electionInfo.owned === true && (
                    <Accordion.Item eventKey={`${index}`}>
                        <Accordion.Header style={{ textAlign: 'center' }}>
                            {electionInfo.title}&nbsp;
                            <br />
                            Creation:&nbsp;{new Date(electionInfo.createdAt).toString()}
                        </Accordion.Header>
                        <Accordion.Body>

                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </>)}
        </Accordion>
    </>
}