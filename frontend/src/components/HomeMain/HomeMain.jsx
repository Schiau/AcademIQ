import React, { useEffect, useState } from 'react';
import { getMyCourses } from '../../services/CoursesServices';
import './HomeMain.css';
import { isTokenValid } from '../../services/authService';

const HomeMain = () => {
    const [index, setIndex] = useState(0);
    const [loggedIn, setLoggedIn] = useState(true);
    const [courses, setCourses] = useState([]);

    const safeIndex = (index + courses.length) % courses.length;

    let currentPair = [];
    if (courses.length > 0) {
        currentPair = [
            courses[safeIndex], 
            courses[(safeIndex + 1) % courses.length],
        ];
    }
    
      useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const result = await getMyCourses();
                setCourses(result);
              } catch (error) {
                console.error('Error fetching courses:', error);
              }
          };

          setLoggedIn(isTokenValid);
          fetchMyCourses()
      }, [navigator]);

    return (
        <div className="container-main">
            <div className="description">
                <p><b>AcademIO</b> is a modern e-learning platform designed to provide high-quality online courses across various domains. Whether you're looking to develop new skills or advance your career, Academic provides a seamless learning experience with engaging content, personalized progress tracking, and multilingual support.</p>
            </div>
            
            <div className={`courses ${!loggedIn ? 'blurred' : ''}`}>   
            {
            currentPair.length === 1 && (
                <div className="course-pair">
                    <div className="course-item">
                        <h3 className='title'>{courses[0].name}</h3>
                        <div className="container-icon">
                        <img src='./caret-right-fill.svg' className='play-icon' alt="Play" />
                        </div>
                    </div>
                </div>
            )}
            {currentPair.length >= 2 && (
                <>
                    <button className="prev-button" onClick={() => {setIndex(index - 1); console.log(index)}}>
                        <img src='./arrow-left-circle.svg' width="50" height="50" alt="Previous" />
                    </button>
                    
                    <div className="course-pair">
                        {currentPair.map((course, idx) => (
                        <div key={idx} className="course-item">
                            <h3 className='title'>{course.name}</h3>
                            <div className="container-icon">
                            <img src='./caret-right-fill.svg' className='play-icon' alt="Play" />
                            </div>
                        </div>
                        ))}
                    </div>

                    <button className="next-button" onClick={() => setIndex(index + 1)}>
                        <img src='./arrow-right-circle.svg' width="50" height="50" alt="Next" />
                    </button>
                </>)}
            </div>

            <div className="quote">
                <p>"Education is the kindling of a flame, not the filling of a vessel."</p>
                <img src="./socrate.png" alt="Socrate"/>
            </div>
        </div>
    );
};

export default HomeMain;
