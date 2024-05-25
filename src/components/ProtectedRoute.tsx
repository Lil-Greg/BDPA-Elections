import { ReactNode, useContext } from "react";
import UserContext from "../context/UserContext";
import { Navigate } from "react-router-dom";

type Props = {
    children: ReactNode,
    allowedUserTypes: string[] //'voter' | 'moderator' |'administrator' | 'super' | 'reporter'
}

export default function ProtectedRoute({ allowedUserTypes, children }: Props) {
    const { isAuthenticated, user } = useContext(UserContext);

    if (user) {
        const isAllowed = allowedUserTypes.includes(user.type);
        if (isAuthenticated === false) {
            return <Navigate to='/login' replace />;
            // replaces entire history with login page, so user cannot go back to previous pages unauthenticated
        }
        if (!isAllowed) {
            return <Navigate to='/' replace />;
        }
    } else {
        return <Navigate to='/login' replace />;
    }


    return <>{children}</>
}