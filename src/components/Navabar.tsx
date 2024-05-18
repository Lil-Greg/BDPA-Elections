import { Outlet } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <h1>Welcome To The Election!</h1>
            <Outlet></Outlet>
        </>
    )
}