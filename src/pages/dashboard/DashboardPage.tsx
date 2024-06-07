import './DashboardPage.css';
import { RefAttributes, useContext } from "react";
import UserContext from '../../context/UserContext';
import { Container, OverlayTrigger, Row, Tab, Tabs, Tooltip, TooltipProps } from "react-bootstrap";
import Profile from './Profile';
import getImageURL from '../../utils/image-util';
import { JSX } from 'react/jsx-runtime';
import UserElections from './UserElections';
import Settings from './Settings';


export default function DashboardPage() {
    const { user } = useContext(UserContext);
    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
        <Tooltip id="button-tooltip" {...props}>
            Change Profile Picture
        </Tooltip>
    );
    const changePfp = () => { };
    const handleOnClick = () => {
        changePfp(/*Mutation that changes the user's saved pfp */);
    }
    // Make another table for pfp
    return (
        <Container className="dashboard-container mt-3">
            <h1>Welcome, {user?.username}</h1>
            <Row className='dashboard-base-content'>
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}>
                    <img src={getImageURL('default-pfp.jpg')} alt="User's Pfp" className='dashboard-pfp' onClick={handleOnClick} />
                </OverlayTrigger>
            </Row>
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="profile" title='Profile'>
                    <Profile />
                </Tab>
                <Tab eventKey="elections" title="Elections">
                    <UserElections />
                </Tab>
                <Tab eventKey="contact" title="Settings">
                    <Settings></Settings>
                </Tab>
            </Tabs>
        </Container>
    )
}