import React from 'react'
import './Header.css'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourse } from '../../services/CoursesServices';
import { isTokenValid } from '../../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const tokenValid = isTokenValid();
    setIsAuthenticated(tokenValid);
  }, [localStorage.getItem('authToken')]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let result = await getCourse(searchQuery, "", "");
      localStorage.setItem('courses', JSON.stringify(result));
      setSearchQuery('');
      navigate('/courses');
    } catch (error) {
      console.error("Error while fetching courses:", error);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/'); 
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/logo.svg" alt="Logo" />
      </div>
      <nav className="nav-links">
        <a href="/courses">Courses</a>
        <a href="/contact">Contact</a>
      </nav>
      <form className="search-bar" onSubmit={handleSearchSubmit}>
                <label htmlFor="search">
                    <img src="/search.svg" alt="Search icon" className="search-icon" />
                </label>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search ..."
                />
            </form>
      {!isAuthenticated ? (
        <a href="/logIn">Log In</a>
      ) : (
        <a href="/" onClick={handleLogOut}>Log Out</a>
      )}
    </header>
  );
};

export default Header;
