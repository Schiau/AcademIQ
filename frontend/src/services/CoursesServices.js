const API_URL = 'http://localhost:3000'; 

export const getCourseById = async (id) => {
  try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          return [];
      }
      const response = await fetch(`${API_URL}/courses/${id}`,{
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result =await response.json();
      return result;
  } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
  }
};

const formatCourses = ( result ) => {
  result = result.map(i => ({
    ...i,  
    current_enroll: i.current_enroll.length,  
    date_start: new Date(i.date_start).toLocaleDateString('en-US', {  
        year: 'numeric',
        month: 'long',
        day: 'numeric', 
    }),
    date_end: new Date(i.date_end).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric', 
    })
  }));
  return result
}

export const getCourse = async (query, startDate, endDate) => {
  try {
      const response = await fetch(`${API_URL}/courses?date_start=${startDate}&date_end=${endDate}&search=${query}`);
      
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const result =formatCourses(await response.json());
      return result;
  } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
  }
};

export const getMyCourses = async () => {
  try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          return [];
      }
      const response = await fetch(`${API_URL}/courses/my-courses`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result =formatCourses(await response.json());
      return result;
  } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
  }
};

export const enrollStudent = async (courseId, studentId) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
      return;
  }
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}/enroll/${studentId}`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
      }
  });

      if (!response.ok) {
          throw new Error('Failed to enroll student');
      }

      const result = await response.json();
      console.log('Enrollment successful:', result);
      return result;
  } catch (error) {
      console.error('Error enrolling student:', error);
  }
};

export const unenrollStudent = async (courseId, studentId) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
      return;
  }
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}/unenroll/${studentId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
      }
  });

      if (!response.ok) {
        console.log(response);
          throw new Error('Failed to enroll student');
      }

      const result = await response.json();
      console.log('Enrollment successful:', result);
      return result;
  } catch (error) {
      console.error('Error enrolling student:', error);
  }
};

export const createCourse = async (courseData) => {
  try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_URL}/courses`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(courseData)
      });

      if (!response.ok) {
          throw new Error('Failed to create course');
      }

      return await response.json();
  } catch (error) {
      console.error('Error creating course:', error);
      throw error;
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_URL}/courses/${courseId}`, {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(courseData)
      });

      if (!response.ok) {
          throw new Error('Failed to update course');
      }

      return await response.json();
  } catch (error) {
      console.error('Error updating course:', error);
      throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_URL}/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error('Failed to delete course');
      }

      return await response.json();
  } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
  }
};

export const getCourseAvgByYear = async (id, year) => {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return [];
        }
        const response = await fetch(`${API_URL}/courses/${id}/avg-students/${year}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const result =await response.json();
        return result.averagePerMonth;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

export const getDatesByMonthAndYear = async (id, month, year) => {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return [];
        }
        const response = await fetch(`${API_URL}/courses/${id}/enrollment-dates/${month}/${year}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const result =await response.json();
        return result.enrollmentDates;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
  };

  export const getStudentsByDayAndMonthAndYear = async (id, day, month, year) => {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return [];
        }
        const response = await fetch(`${API_URL}/courses/${id}/students-after-date/${day}/${month}/${year}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        return result.students;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

export const getPrice = async () => {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return 'default';
        }
        const response = await fetch(`${API_URL}/courses/price`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
    
        if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            return result.totalPrice;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
};