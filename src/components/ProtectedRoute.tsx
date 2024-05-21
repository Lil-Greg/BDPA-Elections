import { ReactNode, useContext } from "react"
import UserContext from "../context/UserContext"
import { useNavigate } from "react-router-dom"

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
    const { isAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            navigate('/auth')
        )
    }
    return <>{children}</>
}