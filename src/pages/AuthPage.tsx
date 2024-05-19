import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function AuthPage() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const handleSubmit = async (event: React.FormEvent) => {
        // event.preventDeault will prevent the page to refresh after the alert
        event.preventDefault();
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (username && password) {
            const [isAuthorized, userInline] = await useAuth(password, username);
            if (isAuthorized) {
                setUser && setUser(userInline);
                window.localStorage.setItem('user', JSON.stringify(user))
                navigate('/')
            }
            alert(`Username: ${username}` + ` Password: ${password}`)
        } else {
            alert(`Please insert value`)
        }
    }
    return <>
        <div className="container">
            {user && username}
            <h1>Login</h1>
            <h3>Enter your login credentials</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="first">
                    Username:
                </label>
                <input type="text"
                    ref={usernameRef}
                    name="first"
                    placeholder="Enter your Username" required />

                <label htmlFor="password">Password:</label>
                <input type="password" ref={passwordRef}
                    name="password" placeholder="Enter your Password" required />
                <div className="submitButton">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </>
}