import { ReactNode, useContext, useEffect } from "react"
import UserContext from "../context/UserContext"
import { useNavigate } from "react-router-dom"

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
    const { isAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('/login', { replace: true });
            // replaces entire history with login page, so user cannot go back to previous pages unauthenticated
        }
    }, [navigate, isAuthenticated]);

    return <>{children}</>
}