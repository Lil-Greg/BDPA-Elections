import { Card, Container, Form, InputGroup, ProgressBar } from "react-bootstrap";
import './RegisterPage.css';
import { ChangeEvent, useContext, useRef, useState } from "react";
import { UserToCreate } from "../../type";
import { api } from '../../../convex/_generated/api';
import { useMutation, useQuery } from "convex/react";
import UserDerivePassword from "../../hooks/useDerivePassword";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function RegisterPage() {
    const { user } = useContext(UserContext);
    if (!user) {
        return;
    }
    const getAllUsers = useQuery(api.users.get);
    const createUser = useMutation(api.users.createUser);
    const [progress, setProgress] = useState<number>(0);
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [sameUsername, setSameUsername] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const navigate = useNavigate();

    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLSelectElement>(null);
    const zipRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const emailValue = emailRef.current?.value;
        const usernameValue = usernameRef.current?.value;
        const passwordValue = passwordRef.current?.value;
        const typeValue = typeRef.current?.value;
        const cityValue = cityRef.current?.value;
        const stateValue = stateRef.current?.value;
        const zipValue = zipRef.current?.value;
        const addressValue = addressRef.current?.value;
        const firstNameValue = firstNameRef.current?.value;
        const lastNameValue = lastNameRef.current?.value;

        if (emailValue && usernameValue && passwordValue && typeValue && cityValue && stateValue && zipValue && addressValue && firstNameValue && lastNameValue != null && stateValue != 'none' && sameUsername === false && invalidUsername === false) {
            const { keyString, saltString } = await UserDerivePassword(passwordValue);
            const formValues: UserToCreate = {
                password: passwordValue,
                salt: saltString,
                key: keyString,
                username: usernameValue,
                email: emailValue,
                type: typeValue,
                city: cityValue,
                state: stateValue,
                zip: zipValue,
                address: addressValue,
                firstName: firstNameValue,
                lastName: lastNameValue
            };
            // Create user
            createUser(formValues);
            navigate('/login', { replace: true });
        } else {
            alert("ADD SOME STUFF!!");
        }
    };

    const handlePasswordChange = () => {
        const password = passwordRef.current?.value;
        const passwordLength = password?.length || 0;
        setProgress(passwordLength);
    }
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const checkForSameUsername = getAllUsers?.filter(userData => userData.username === e.currentTarget.value);
        if (checkForSameUsername?.length === 0) {
            setSameUsername(false);
        } else {
            setSameUsername(true);
        }
        const username = usernameRef.current?.value;
        setInvalidUsername((/[^0-9a-zA-Z]+/ig).test(username || ''));
    }
    const togglePasswordShow = () => {
        setPasswordShow(!passwordShow);
    }

    return <>
        <Container className="register-container">
            <Card className="register-card">
                <Card.Title style={{ textAlign: 'center' }}><h1>Create A User</h1></Card.Title>
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="inputEmail4" className="form-label" >Email</label>
                        <input type="email" className="form-control" id="inputEmail4" ref={emailRef} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputFirst" className="form-label" >First Name</label>
                        <input type="text" autoCapitalize="on" className="form-control" id="inputFirst" ref={firstNameRef} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputLast" className="form-label" >Last Name</label>
                        <input type="text" autoCapitalize="on" className="form-control" id="inputLast" ref={lastNameRef} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputPassword4" className="form-label">Password</label>
                        <InputGroup className="mb-1">
                            <Form.Control type={passwordShow ? "text" : "password"} placeholder="Password" onChange={handlePasswordChange} ref={passwordRef} id="inputPassword4" required />
                            <InputGroup.Text onClick={togglePasswordShow}>{passwordShow ? <FaRegEyeSlash /> : <FaRegEye />}</InputGroup.Text>
                        </InputGroup>
                        <ProgressBar now={progress} max={18} variant={progress > 17 ? 'success' : progress <= 10 ? 'danger' : 'warning'} />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="inputUsername" className="form-label" >Username</label>
                        <Form.Control
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            onChange={handleUsernameChange}
                            id="inputUsername"
                            ref={usernameRef}
                            isInvalid={invalidUsername === true ? invalidUsername : sameUsername}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {invalidUsername === true ? 'Must Be Alpha-Numeric' :
                                sameUsername === true && 'Already A User With this Username'}
                        </Form.Control.Feedback>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="typeState" className="form-label">Type</label>
                        <select id="typeState" className="form-select" ref={typeRef} defaultValue="voter">
                            <option value="voter">Voter</option>
                            <option value="reporter">Reporter</option>
                            {user.type !== "moderator"
                                && user.type !== "reporter"
                                && user.type !== "voter" && (<option value="moderator">Moderator</option>)}
                            {user.type === "super" && (<option value="administrator">Administrator</option>)}
                        </select>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputAddress" className="form-label">Address</label>
                        <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" ref={addressRef} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputCity" className="form-label">City</label>
                        <input type="text" className="form-control" id="inputCity" ref={cityRef} required />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="inputState" className="form-label">State</label>
                        <select id="inputState" className="form-select" ref={stateRef} defaultValue={'none'} required>
                            <option value='none' disabled>Choose...</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="inputZip" className="form-label">Zip</label>
                        <input type="text" className="form-control" id="inputZip" ref={zipRef} required />
                    </div>
                    <div className="col-12 submit-button">
                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </div>
                </form>
            </Card>
        </Container>
    </>
}

