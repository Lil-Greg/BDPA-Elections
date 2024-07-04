import { ReactNode, useState } from "react"
import UserContext from "./UserContext"
import { User } from "../type";

interface Props {
    children: ReactNode
}

// Not Working b/c user is set to null
// and localStorage will not accept
// it's initial value
export default function UserContextProvider({ children }: Props) {
    const brother = window.localStorage.getItem('election-user');
    const defaultUser = brother !== undefined && brother ? JSON.parse(brother) : null;
    const [user, setUser] = useState<User | null>(() => defaultUser);
    const isAuthenticated = !!user; // sets Authenticated to user but with a boolean 
    // But, makes sure it returns a boolean

    return <UserContext.Provider value={{ isAuthenticated, user, setUser }}>
        {children}
    </UserContext.Provider>
}