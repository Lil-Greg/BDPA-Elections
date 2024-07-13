import { useMutation, useQuery } from "convex/react";
import React, { useRef, useState } from "react";
import { Button, Container, Form, InputGroup, ProgressBar } from "react-bootstrap";
import { api } from "../../../convex/_generated/api";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { User } from "../../type";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [passwordShow, setPasswordShow] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [emailState, setEmailState] = useState('');
  const [passwordState, setPasswordState] = useState("");
  const [userAc, setUserAc] = useState<User>();

  const authEmail = useQuery(api.users.emailAuth, { email: emailState });
  const changePassword = useMutation(api.users.changeUserInProfile);

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.currentTarget.value;
    if (!authEmail || authEmail.length === 0) {
      setEmailError(true);
      return;
    } else {
      setEmailState(email);
      setEmailError(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    const passwordLength = password.length;
    setProgress(passwordLength);
    if (progress > 10) {
      setPasswordState(password);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailError && authEmail && authEmail.length > 0) {
      setUserAc(authEmail[0]);
      setPasswordField(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError === false && userAc) {
      changePassword({ id: userAc._id, selectedField: { password: passwordState } });
      navigate("/login", { replace: true });
    }
  };

  const togglePasswordShow = () => {
    setPasswordShow(!passwordShow);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      {passwordField === false ? (
        <Form onSubmit={handleEmailSubmit} className="d-flex justify-content-center align-items-center flex-column">
          <Form.Control
            type="email"
            size="lg"
            placeholder="Email"
            className="mb-2"
            isInvalid={emailError}
            onChange={handleEmailChange}
            ref={emailRef}
          />
          <Form.Control.Feedback type="invalid">Invalid Email</Form.Control.Feedback>
          <Button type="submit">Check Email</Button>
        </Form>
      ) : (
        <Form onSubmit={handleSubmit} className="d-flex justify-content-center align-items-center flex-column">
          <div className="mb-2">
            <InputGroup className="mb-1">
              <Form.Control
                type={passwordShow ? "text" : "password"}
                placeholder="Password"
                size="lg"
                onChange={handlePasswordChange}
                ref={passwordRef}
                id="inputPassword4"
                isInvalid={passwordError}
              />
              <Form.Control.Feedback type="invalid">Password Must Be Greater Than 10 Characters</Form.Control.Feedback>
              <InputGroup.Text onClick={togglePasswordShow}>{passwordShow ? <FaRegEyeSlash /> : <FaRegEye />}</InputGroup.Text>
            </InputGroup>
            <ProgressBar now={progress} max={18} variant={progress > 17 ? 'success' : progress <= 10 ? 'danger' : 'warning'} />
          </div>
          <Button>Change Password</Button>
        </Form>
      )}
    </Container>
  )
}