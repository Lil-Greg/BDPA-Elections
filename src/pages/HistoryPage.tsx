import ElectionHistory from "../components/ElectionHistory"

export default function History(){
    return<>
        <div className = "container">
            <div className="electionBoxes">
                 {ElectionHistory()}
            </div>
        </div>
    </>
}