import ElectionHistory from "../components/ElectionHistory"

export default function HistoryPage(){
    return<>
        <div className = "container">
            <div className="electionBoxes">
                 <ElectionHistory></ElectionHistory>
            </div>
        </div>
    </>
}