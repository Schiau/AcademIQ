import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, isTokenValid } from "../../services/authService";
import "./LogInForm.css";

const LogInForm = () => {

const navigator = useNavigate()
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

useEffect(() => {
  const tokenValid = isTokenValid();
  if (tokenValid) {
    navigator("/"); 
  }
}, [navigator]);


const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await loginUser(email, password); 
    navigator("/");

  } catch (error) {
    console.error("Login failed:", error);
  }
};

  return (
      <div className="login-card">
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              placeholder="EMAIL"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="PASSWORD"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={4}
            />
          </div>

          <button type="submit" className="login-btn">LOG IN</button>
        </form>

        <a href="/register" className="register-link">Register</a>
      </div>
  );
};

export default LogInForm;
