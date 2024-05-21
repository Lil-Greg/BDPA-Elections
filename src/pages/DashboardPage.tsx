import { useContext } from "react"
import UserContext from "../context/UserContext"


export default function DashboardPage() {
    const { user } = useContext(UserContext);
    return (
        <>
            <div className="container">

            </div>
        </>
    )
}