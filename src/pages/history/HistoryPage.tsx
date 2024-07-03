import { useState, useContext } from 'react';
import { Accordion, Pagination } from 'react-bootstrap';
import './HistoryPage.css';
import UserContext from '../../context/UserContext';
import useElectionHistory from '../../hooks/useElectionHistory';

export default function HistoryPage() {
  const { user } = useContext(UserContext)  
  const { elections, isLoading, isErroring } = useElectionHistory()  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Number of elections per page

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  if (isLoading) {
    return <>Loading...</>;
  }

  if (isErroring) {
    return <>Something Went Wrong!</>;
  }
  if (!elections){
    throw new Error 
  }

  // Calculate which elections to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentElections = elections.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(elections.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Pagination className="pagination">
          <Pagination.Prev
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i}
              active={currentPage === i + 1}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      <Accordion>
        {currentElections.map((electionInfo, index) => {
          const evenOrOdd = index % 2 === 0 ? 'even' : 'odd';
          return (
            <Accordion.Item key={index} eventKey={`${index}`} className={`history-${evenOrOdd}`}>
              <Accordion.Header>
                <div className="idk">
                  <h5>{electionInfo.title}</h5>
                  <div>
                    <span style={{ fontWeight: '650' }}>Creation:</span>&nbsp;
                    {monthNames[(new Date(electionInfo.createdAt).getUTCMonth())]}&nbsp;
                    {new Date(electionInfo.createdAt).getUTCDate().toString()},&nbsp;
                    {new Date(electionInfo.createdAt).getFullYear().toString()}
                  </div>
                  <div>
                    <span style={{ fontWeight: '650' }}>Closed At:</span>&nbsp;
                    {monthNames[(new Date(electionInfo.closesAt).getUTCMonth())]}&nbsp;
                    {new Date(electionInfo.closesAt).getUTCDate().toString()},&nbsp;
                    {new Date(electionInfo.closesAt).getFullYear().toString()}
                  </div>
                  <div>
                    <span style={{ fontWeight: '650' }}>Opened At:</span>&nbsp;
                    {monthNames[(new Date(electionInfo.opensAt).getUTCMonth())]}&nbsp;
                    {new Date(electionInfo.opensAt).getUTCDate().toString()},&nbsp;
                    {new Date(electionInfo.opensAt).getFullYear().toString()}
                  </div>
                  {(user?.type === 'administrator' || user?.type === 'super') && (
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
                {/* Body content if needed */}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
}
