import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCourse, getCourseById, updateCourse } from "../../services/CoursesServices";
import "./CourseForm.css";

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    sessions: '',
    date_start: '',
    date_end: '',
    max_slots: '',
    languages: '',
    description: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      if (id) {
        const course = await getCourseById(id);
        if (course) {
          setFormData({
            id: course.id || '',
            name: course.name || '',
            category: course.category || '',
            price: course.price || '',
            sessions: course.sessions || '',
            date_start: course.date_start ? course.date_start.split('T')[0] : '', 
            date_end: course.date_end ? course.date_end.split('T')[0] : '',
            max_slots: course.max_slots || '',
            languages: course.languages || '',
            description: course.description || '',
          });
        }
      }
    };
  
    fetchCourse();
  }, [id]);

  const handleChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCourse(id, formData); 
      } else {
        await createCourse(formData);
      }
      navigate("/courses");
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  return (
    <div className="course-card">
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-row">
          <div className="form-column">
            <div className="input-group">
              <span className="icon">📚</span>
              <input
                type="text"
                placeholder="Course Name"
                required
                value={formData.name}
                onChange={(e) => handleChange(e, 'name')}
              />
            </div>

            <div className="input-group">
              <span className="icon">🏷️</span>
              <input
                type="text"
                placeholder="Category"
                required
                value={formData.category}
                onChange={(e) => handleChange(e, 'category')}
              />
            </div>

            <div className="input-group">
              <span className="icon">💲</span>
              <input
                type="number"
                placeholder="Price"
                required
                value={formData.price}
                onChange={(e) => handleChange(e, 'price')}
              />
            </div>

            <div className="input-group">
              <span className="icon">📅</span>
              <input
                type="date"
                placeholder="Start Date"
                required
                value={formData.date_start}
                onChange={(e) => handleChange(e, 'date_start')}
              />
            </div>

            <div className="input-group">
              <span className="icon">📅</span>
              <input
                type="date"
                placeholder="End Date"
                required
                value={formData.date_end}
                onChange={(e) => handleChange(e, 'date_end')}
              />
            </div>
          </div>

          <div className="form-column">
            <div className="input-group">
              <span className="icon">🔢</span>
              <input
                type="number"
                placeholder="Max Slots"
                required
                value={formData.max_slots}
                onChange={(e) => handleChange(e, 'max_slots')}
              />
            </div>
            <div className="input-group">
              <input
                type="number"
                placeholder="Number of Sessions"
                required
                value={formData.sessions}
                onChange={(e) => handleChange(e, 'sessions')}
              />
            </div>
            <div className="input-group">
              <span className="icon">🌍</span>
              <input
                type="text"
                placeholder="Languages"
                required
                value={formData.languages}
                onChange={(e) => handleChange(e, 'languages')}
              />
            </div>

            <div className="input-group">
              <span className="icon">📝</span>
              <textarea
                placeholder="Course Description"
                required
                value={formData.description}
                onChange={(e) => handleChange(e, 'description')}
                rows="4"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="course-btn">Submit</button>
      </form>
    </div>
  );
};

export default CourseForm;
