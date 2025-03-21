import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect} from 'react';
import './CourseItem.css';
import { enrollStudent, unenrollStudent, deleteCourse, getPrice} from '../../services/CoursesServices';
import { getId } from '../../services/authService';

const CourseItem = ({ course, userRole, myCourses, setUpdateTrigger })=> {
    const [userId, setUserId] = useState(null);
    const navigator = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userIdResult = await getId();
                setUserId(userIdResult);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []); 

    const isEnrolled = myCourses.some((myCourse) => myCourse._id === course._id);
    const isFull = course.current_enroll >= course.max_slots;

    const alertPrice = async () =>{
        const price = await getPrice();
        alert(`You have to pay ${price} for all the active courses`);
    }

    const handleEnroll = async () => {
        await enrollStudent(course._id, userId);
        alertPrice();
        setUpdateTrigger(prev => prev + 1); 
    };
    
    const handleUnenroll = async () => {
        await unenrollStudent(course._id, userId);
        alertPrice();
        setUpdateTrigger(prev => prev + 1);
    };
    
      const handleModify = () => {
        navigator(`/course/${course._id}`)
      };
    
      const handleStatistics = () => {
        navigator(`/course-stats/${course._id}`)
      };
    
      const handleDelete = () => {
        deleteCourse(course._id);
        setUpdateTrigger(prev => prev + 1);
      };

    return (
        <div className={`course-card`}>
            <div className="header-card ">
                <h2>{course.name}</h2>
                <span className="category">{course.category}</span>
            </div>

            <div className="course-details">
                <div className="info">
                <p><strong>Period:</strong> {course.date_start} - {course.date_end}</p>
                <p><strong>Sessions:</strong> {course.sessions}</p>
                <p>
                    <strong>Languages:</strong>
                    {
                        course.languages
                        .map(l=> l[0].toUpperCase()+l[1].toUpperCase())
                        .join(', ')
                }</p>
                </div>
                
                <div className="description">
                <h3>Description:</h3>
                <p>{course.description}</p>
                </div>
            </div>

            <div className="bootom-card">
                <p className="price">${course.price}</p>
                <p className="slots">Slots: {course.current_enroll} / {course.max_slots}</p>
            </div>

            <div className="buttons">
                {userRole === 'student' && (
                    <>
                        {isEnrolled ? (
                            <button
                            className={`btn unenroll ${isFull && !isEnrolled? 'full' : ''}`}
                                onClick={handleUnenroll}
                                disabled={isFull && !isEnrolled}
                            >
                                <img src="/dash-circle.svg" alt="Minus icon" className="icon" />
                                Unenroll
                            </button>
                        ) : (
                            <button
                                className={`btn enroll ${isFull && !isEnrolled? 'full' : ''}`}
                                onClick={handleEnroll}
                                disabled={isFull && !isEnrolled}
                            >
                                <img src="/plus-circle.svg" alt="Plus icon" className="icon" />
                                Enroll
                            </button>
                        )}
                    </>
                )}

                {userRole === 'professor' && (
                <>
                    <button
                    className="btn modify"
                    onClick={handleModify}
                    >
                        <img src="/pencil.svg" alt="Pencil icon"  className='icon'/>
                        <span>Modify</span>
                    </button>
                    <button
                    className="btn statistics"
                    onClick={handleStatistics}
                    >
                    Statistics
                    </button>
                    <button
                    className="btn delete"
                    onClick={handleDelete}
                    >
                        <img src="/trash.svg" alt="Trash icon"  className='icon'/>  
                        Delete
                    </button>
                </>
                )}
            </div>
        </div>
    );
};

export default CourseItem;
