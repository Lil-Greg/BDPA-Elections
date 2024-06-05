import './DashboardPage.css';
import { useContext } from "react";
import UserContext from '../../context/UserContext';
import { Container, Tab, Tabs } from "react-bootstrap";
import Profile from './Profile';
import Settings from './Settings';


export default function DashboardPage() {
    const { user } = useContext(UserContext);
    // Make another table for pfp
    return (
        <Container className="dashboard-container mt-3">
            <h1>Welcome, {user?.username}</h1>
            <Profile />
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="home" title='Profile'>
                   
                </Tab>
                <Tab eventKey="profile" title="Elections">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="contact" title="Settings">
                    Tab content for Contact
                    <Settings></Settings>
                </Tab>
            </Tabs>
        </Container>
    )
}