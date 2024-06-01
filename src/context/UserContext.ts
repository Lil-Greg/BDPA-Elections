import { createContext } from "react";
import { UserContextType } from "../type";

const UserContext = createContext<UserContextType>({isAuthenticated: false, user: null, setUser: null});

export default UserContext;