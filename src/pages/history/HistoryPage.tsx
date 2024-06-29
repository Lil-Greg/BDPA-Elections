import { Accordion } from 'react-bootstrap';
import './HistoryPage.css';
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
import useElectionHistory from "../../hooks/useElectionHistory";

export default function HistoryPage() {
    const { user } = useContext(UserContext);
    const { elections, isLoading, isErroring } = useElectionHistory();
    const monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (isLoading) {
        return <>
            Loading...
        </>
    };
    if (isErroring) {
        return <>
            Something Went Wrong!
        </>
    };
    return <>
        <Accordion>
            {elections && elections.map((electionInfo, index) => {
                const evenOrOdd = index % 2 === 0 ? 'even' : 'odd';
                return <>
                    <Accordion.Item eventKey={`${index}`} className={`history-${evenOrOdd}`}>
                        <Accordion.Header>
                            <div className="idk">
                                <h5>{electionInfo.title}</h5>
                                <div>
                                    <span style={{ fontWeight: '650' }}>Creation:</span>&nbsp;
                                    {monthNames[(new Date(electionInfo.createdAt).getUTCMonth())]}&nbsp;
                                    {new Date(electionInfo.createdAt).getDay().toString()},&nbsp;
                                    {new Date(electionInfo.createdAt).getFullYear().toString()}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '650' }}>Closed At:</span>&nbsp;
                                    {monthNames[(new Date(electionInfo.closesAt).getUTCMonth())]}&nbsp;
                                    {new Date(electionInfo.closesAt).getDay().toString()},&nbsp;
                                    {new Date(electionInfo.closesAt).getFullYear().toString()}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '650' }}>Opened At:</span>&nbsp;
                                    {monthNames[(new Date(electionInfo.opensAt).getUTCMonth())]}&nbsp;
                                    {new Date(electionInfo.opensAt).getDay().toString()},&nbsp;
                                    {new Date(electionInfo.opensAt).getFullYear().toString()}
                                </div>
                                {user?.type === 'administrator' ? (
                                    <>
                                        <div>
                                            <span style={{ fontWeight: '650' }}>Owned:</span>&nbsp;
                                            {electionInfo.owned ? 'Yes' : 'No'}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: '650' }}>Deleted:</span>&nbsp;
                                            {electionInfo.deleted ? 'Yes' : 'No'}
                                        </div>
                                    </>
                                ) : user?.type === 'super' && (
                                    <>
                                        <div>
                                            <span style={{ fontWeight: '650' }}>Owned:</span>&nbsp;
                                            {electionInfo.owned ? 'Yes' : 'No'}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: '650' }}>Deleted:</span>&nbsp;
                                            {electionInfo.deleted ? 'Yes' : 'No'}
                                        </div>
                                    </>
                                )}
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>

                        </Accordion.Body>
                    </Accordion.Item>
                </>
            })}
        </Accordion>
    </>
}