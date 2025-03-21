import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, isTokenValid } from "../../services/authService";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const navigator = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [shake, setShake] = useState(false);
  useEffect(() => {
    const tokenValid = isTokenValid();
    if (tokenValid) {
      navigator("/"); 
    }
  }, [navigator]);


  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setShake(true);
      setTimeout(() => {
        setShake(false); 
      }, 1000);
      return; 
    }

    try {
      await registerUser(formData.email, formData.password, formData.name);
      navigator("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
      <div className="register-card">
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="NAME"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              name="email"
              placeholder="E-MAIL"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              required
              value={formData.password}
              onChange={handleChange}
              className={shake ? "shake" : ""}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="CONFIRM PASSWORD"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={shake ? "shake" : ""}
            />
          </div>

          <button type="submit" className="register-btn">REGISTER</button>
        </form>

        <a href="/logIn" className="login-link">LOG IN</a>
      </div>
  );
};

export default RegistrationForm;
