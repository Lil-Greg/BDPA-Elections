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

    if (!isAuthenticated || !user) {
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
