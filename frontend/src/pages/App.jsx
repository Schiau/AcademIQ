import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageTemplate } from './PageTemplate/PageTemplate';
import ContactInfo from '../components/ContactInfo/ContactInfo';
import LogInForm from '../components/LogInForm/LogInForm';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import HomeMain from '../components/HomeMain/HomeMain';
import CourseForm from '../components/CourseForm/CourseForm';
import Chat from '../components/Chat/Chat';
import CourseStats from '../components/CourseStats/CourseStats';
import { CourseSearch } from '../components/CourseSearch/CourseSearch';
import { getRole } from '../services/authService';

function App() {
  useEffect(() => {
    const fetchRole = async () => {
      const role = await getRole();
      localStorage.setItem("role",role);
    };

    fetchRole();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageTemplate MainComponent={HomeMain} />} />
        <Route path="/courses" element={<PageTemplate MainComponent={CourseSearch} />} />
        <Route path="/course" element={<PageTemplate MainComponent={CourseForm } />} />
        <Route path="/course/:id" element={<PageTemplate MainComponent={CourseForm} />} />
        <Route path="/contact" element={<PageTemplate MainComponent={ContactInfo} />} />
        <Route path="/chat" element={<PageTemplate MainComponent={Chat} />} />
        <Route path="/logIn" element={<PageTemplate MainComponent={LogInForm} />} />
        <Route path="/register" element={<PageTemplate MainComponent={RegistrationForm} />} />
        <Route path="/course-stats/:id" element={<PageTemplate MainComponent={CourseStats} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
