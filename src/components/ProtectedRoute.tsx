import { ReactNode, useContext } from "react";
import UserContext from "../context/UserContext";
import { Navigate } from "react-router-dom";

type Props = {
    children: ReactNode;
    allowedUserTypes: string[]; // 'voter' | 'moderator' | 'administrator' | 'super' | 'reporter'
    maintenanceMode?: boolean;
};

export default function ProtectedRoute({ allowedUserTypes, children, maintenanceMode }: Props) {
    const { isAuthenticated, user } = useContext(UserContext);

    if (user) {
        const isAllowed = allowedUserTypes.includes(user.type);
        if (isAuthenticated === false) {
            console.warn("User not logged in");
            return <Navigate to='/login' replace />;
            // replaces entire elections with login page, so user cannot go back to previous pages unauthenticated
        }
        if (!isAllowed) {
            console.warn("User not allowed on page");
            console.log(allowedUserTypes);
            console.log(user)
            console.log(user.type)
            return <Navigate to='/' replace />;
        }
    } else {
        console.warn("User not logged in");
        return <Navigate to='/login' replace />;
    }

    const isAllowed = allowedUserTypes.includes(user.type);

    if (!isAllowed) {
        return <Navigate to='/' replace />;
    }

    if (maintenanceMode && (user.type !== 'administrator' && user.type !== 'super')) {
        return <Navigate to='/maintenance' replace />;
    }

    return <>{children}</>;
}
