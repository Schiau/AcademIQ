import React, { useEffect, useState } from 'react';
import { getCourse, getMyCourses} from '../../services/CoursesServices';
import { useNavigate } from 'react-router-dom';
import CourseItem from '../CourseItem/CourseItem'
import './CourseSearch.css'

export const CourseSearch = () => {
    const navigator = useNavigate()
    const [courses, setCourses] = useState([]);
    const role = localStorage.getItem('role')  || 'default'
    const [query, setQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [myCourses, setMyCourses] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const result = await getMyCourses();
                setMyCourses(result);
            } catch (error) {
                console.error('Error fetching enrolled courses:', error);
            }
        };
    
        fetchMyCourses();
    }, [updateTrigger, navigator]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        getCourse(query, startDate, endDate)
            .then(result => {
                setCourses(result);
                console.log('Courses fetched:', result);  
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    };

    useEffect(() => {
        const storedCourses = localStorage.getItem('courses');
        
        if (storedCourses) {
            try {
                const parsedCourses = JSON.parse(storedCourses);
                setCourses(parsedCourses);
                localStorage.removeItem('courses');
            } catch (error) {
                console.error('Error parsing stored courses:', error);
            }
        } else {
            getCourse(query, startDate, endDate)
                .then(result => {
                    setCourses(result);
                })
                .catch(error => {
                    console.error('Error fetching courses:', error);
                });
        }
    }, [query, startDate, endDate, updateTrigger, navigator]);

    if (!courses ) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-search">
            <form className="search-querrys" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search courses..."
                    className="search-input"
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="calendar-picker"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="calendar-picker"
                />
                <button type="submit" className="search-button">
                    <img src="/search.svg" alt="Search icon" />
                </button>
            </form>

            <div className="role-buttons">
                {role === 'professor' && (
                <div className="professor-buttons">
                    <button className="add-course-btn" onClick={ () => navigator('/course')}>
                        <img src="/plus-circle.svg" alt="Plus icon"/>
                        Add Course
                    </button>
                </div>
                )}

                {role === 'student' && (
                <div className="student-buttons" onClick={() => navigator('/chat')}>
                    <button className="chatbot-btn">Chat Bot</button>
                </div>
                )}
            </div>

            <br></br>

            <div className="course-list-container">
                {courses.map((course) => (
                    <CourseItem 
                    key={course._id} 
                    course={course} 
                    userRole={role} 
                    myCourses={myCourses} 
                    setUpdateTrigger={setUpdateTrigger} 
                    />
                ))}
            </div>
        </div>
    );
};
