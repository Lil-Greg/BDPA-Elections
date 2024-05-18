export default function authPage() {
    return <>
        <div className="container">
            <h1>Login</h1>
            <h3>Enter your login credentials</h3>
            <form action="">
                <label htmlFor="first">
                    Username:
                </label>
                <input type="text"
                    id="userName"
                    name="first"
                    placeholder="Enter your Username" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="passWord"
                    name="password" placeholder="Enter your Password" required />
                <div className="submitButton">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </>
}