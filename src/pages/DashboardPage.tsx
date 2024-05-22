import { useContext } from "react"
import UserContext from "../context/UserContext"


export default function DashboardPage() {
    const { user } = useContext(UserContext);
    return (
        <>
            <div className="container">
                {user && user.type && user.username}
            </div>
        </>
    )
}