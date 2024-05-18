import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
// Define the shape of the form state
interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const checkPasswordStrength = (password: string) => {
    if (password.length > 17 ) {
      setPasswordStrength('strong');
    } else if (password.length > 10) {
      setPasswordStrength('moderate');
    } else {
      setPasswordStrength('weak');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleLogin = () => {
    if (passwordStrength === 'weak') {
      alert('Password is too weak. Please use a stronger password.');
      return;
    }

    // Replace this with your actual authentication logic
    if (username === 'user' && password === 'password') {
      localStorage.setItem('authenticated', 'true');
      navigate('/landing');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <div>
        Password strength: 
        <span style={{ 
          color: passwordStrength === 'weak' ? 'red' :
                 passwordStrength === 'moderate' ? 'orange' :
                 'green'
        }}>
          {passwordStrength}
        </span>
      </div>
      <button onClick={handleLogin} disabled={passwordStrength === 'weak'}>
        Login
      </button>
    </div>
  );
};
  // // Initialize form state
  // const [form, setForm] = useState<LoginForm>({ username: '', password: '' });

  // // Handle form input changes
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setForm({
  //     ...form,
  //     [name]: value,
  //   });
  // };

  // // Handle form submission
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle login logic here
  //   console.log('Form submitted', form);
  // };(
  //   <div className="login-container">
  //     <h2>Login</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div className="form-group">
  //         <label htmlFor="username">Username</label>
  //         <input
  //           type="text"
  //           id="username"
  //           name="username"
  //           value={form.username}
  //           onChange={handleChange}
  //           required
  //         />
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="password">Password</label>
  //         <input
  //           type="password"
  //           id="password"
  //           name="password"
  //           value={form.password}
  //           onChange={handleChange}
  //           required
  //         />
  //       </div>
  //       <button type="submit">Login</button>
  //     </form>
  //   </div>
  // );

export default Login;
