import ElectionHistory from "../components/ElectionHistory"
import usePagination from "../hooks/usePagination"

export default function HistoryPage(){
    const { elections, totalPages, nextAfter, previousAfter, currentPage, handleNext, handlePrev } = usePagination();
    return<>
        <div className = "container">
            <div className="electionBoxes">
            {elections && elections?.elections.map(election => (
                <div className="electionBox">
                    <div key={election?.election_id}>
                        <h3 className="electionTitle">{election?.title}</h3>
                        <p className="electionDescript">{election?.description}</p>
                        <ul>
                            {election?.options.map(option => (
                                <div className="electionOption"><li key={option}>{option}</li></div>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
            </div>
            <div>
            { previousAfter && <button onClick={handlePrev}>Prev</button>}
            { currentPage } of {totalPages} Pages
            { nextAfter && <button onClick={handleNext}>Next</button>}
            </div>
        </div>
    </>
}