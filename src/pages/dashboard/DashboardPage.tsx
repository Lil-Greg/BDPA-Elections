import './DashboardPage.css';
import { RefAttributes, useContext } from "react";
import UserContext from '../../context/UserContext';
import { Container, OverlayTrigger, Row, Tab, Tabs, Tooltip, TooltipProps } from "react-bootstrap";
import Profile from './dashboard-components/Profile';
import getImageURL from '../../utils/image-util';
import { JSX } from 'react/jsx-runtime';
import Settings from './dashboard-components/Settings';
import AdminElections from './dashboard-components/AdminElections';
import AssignPage from './dashboard-components/AssignPage';

export default function DashboardPage() {
    const { user } = useContext(UserContext);
    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
        <Tooltip id="button-tooltip" {...props}>
            Change Profile Picture
        </Tooltip>
    );
    return (
        <Container className="dashboard-container mt-3">
            <h1>Welcome, {user?.username}</h1>
            <Row className='dashboard-base-content'>
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}>
                    <img src={getImageURL('default-pfp.jpg')} alt="User's Pfp" className='dashboard-pfp' />
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
                {user?.type === 'administrator' ? (
                    <Tab eventKey="assignment" title="Assignment">
                        <AssignPage />
                    </Tab>
                ) : user?.type === 'voter' ? (
                    <Tab eventKey="elections" title="Elections">
                        <AdminElections />
                    </Tab>
                ) : user?.type === 'moderator' ? (
                    <Tab eventKey="elections" title="Elections">
                        <AdminElections />
                    </Tab>
                ) : user?.type === 'super' ? (
                    <Tab eventKey="elections" title="Elections">
                        <AdminElections />
                    </Tab>
                ) : user?.type === 'reporter' && (
                    <Tab eventKey="elections" title="Elections">
                        <AdminElections />
                    </Tab>
                )}
                <Tab eventKey="settings" title="Settings">
                    <Settings />
                </Tab>
            </Tabs>
        </Container>
    );
}