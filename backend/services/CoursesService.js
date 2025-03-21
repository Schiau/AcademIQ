const Course = require('../models/Course');  
const User = require('../models/User');

async function searchCourses(date_start, date_end, search) {
    let query = {};

    if (date_start) {
        query.date_start = { $gte: new Date(date_start) };  
    }
    
    if (date_end) {
        query.date_end = { $lte: new Date(date_end) }; 
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } }, 
            { category: { $regex: search, $options: 'i' } } 
        ];
    }

    try {
        const filteredCourses = await Course.find(query);
        return filteredCourses.filter(course => new Date(course.date_end) > new Date());
    } catch (err) {
        console.error("Error fetching courses:", err);
        throw new Error("Error fetching courses");
    }
}

const enrollStudent = async (courseId, studentId) => {
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }

        if (course.current_enroll.length >= course.max_slots) {
            throw new Error('Course is full');
        }

        course.current_enroll.push({
            studentId,
            enrollmentDate: new Date()
        });
        await course.save();
        return { success: true, message: 'Student enrolled successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const unenrollStudent = async (courseId, studentId) => {
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }

        if (!course.current_enroll.some(enrollment => enrollment.studentId.toString() === studentId)) {
            throw new Error('Student is not enrolled in this course');
        }

        course.current_enroll = course.current_enroll.filter(enrollment => enrollment.studentId.toString() !== studentId);
        await course.save();

        return { success: true, message: 'Student unenrolled successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAvgStudentsAfterYear = async (courseId, year) => {
    try {
        const course = await Course.findById(courseId);

        if (!course) return { error: "Course not found" };

        const courseStartDate = new Date(course.date_start);
        const courseEndDate = new Date(course.date_end);

        if (courseEndDate.getFullYear() < year || courseStartDate.getFullYear() > year) {
            return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, avgStudents: 0 }));
        }

        let monthlyEnrollments = new Array(12).fill(0); 
        let daysInMonth = new Array(12).fill(0);

        for (let i = 0; i < 12; i++) {
            daysInMonth[i] = new Date(year, i + 1, 0).getDate();
        }

        const enrollments = course.current_enroll.sort((a, b) =>
            new Date(a.enrollmentDate) - new Date(b.enrollmentDate)
        );

        enrollments.forEach(enrollment => {
            const enrollDate = new Date(enrollment.enrollmentDate);
            
            if (enrollDate < courseStartDate || enrollDate > courseEndDate) {
                return;
            }

            for (let month = 0; month < 12; month++) {
                const monthStart = new Date(year, month, 1); 
                const monthEnd = new Date(year, month + 1, 0); 

                const overlapStart = enrollDate > monthStart ? enrollDate : monthStart;
                const overlapEnd = courseEndDate < monthEnd ? courseEndDate : monthEnd;

                if (overlapStart <= overlapEnd) {
                    const daysInOverlap = (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24) + 1;
                    monthlyEnrollments[month] += daysInOverlap;
                }
            }
        });

        let averagePerMonth = monthlyEnrollments.map((sum, index) => ((sum / daysInMonth[index]).toFixed(2)));

        return { averagePerMonth };
    } catch (error) {
        console.error(error);
        return { error: "Failed to calculate average students per month" };
    }
};


const getEnrollmentDatesByMonthAndYear = async (courseId, month, year) => {
    try {
        const course = await Course.findById(courseId);
        if (!course) return { error: "Course not found" };

        const courseStartDate = new Date(course.date_start);
        const courseEndDate = new Date(course.date_end);

        let enrollmentDates = [];

        course.current_enroll.forEach(enrollment => {
            const enrollDate = new Date(enrollment.enrollmentDate);
            if (enrollDate >= courseStartDate && enrollDate <= courseEndDate) {
                let currentDate = new Date(enrollDate);
                while (currentDate <= courseEndDate) {
                    if (currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month) {
                        enrollmentDates.push(currentDate.toISOString().split("T")[0]);
                    }
                    currentDate.setDate(currentDate.getDate() + 1); 
                }
            }
        });

        enrollmentDates = [...new Set(enrollmentDates)];

        return { enrollmentDates };
    } catch (error) {
        console.error(error);
        return { error: "Failed to fetch enrollment dates" };
    }
};

const getStudentsAfterDate = async (courseId, day, month, year) => {
    try {
        const course = await Course.findById(courseId).populate('current_enroll.studentId', 'name'); 

        if (!course) return { error: "Course not found" };

        const courseEndDate = new Date(course.date_end);
        const targetDate = new Date(year, month - 1, day);
        courseEndDate.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);
        let studentNames = [];
        course.current_enroll.forEach(enrollment => {
            const enrollDate = new Date(enrollment.enrollmentDate);
            enrollDate.setHours(0, 0, 0, 0);
            if (enrollDate <= targetDate && targetDate <= courseEndDate) {
                studentNames.push(enrollment.studentId.name);
            }
        });

        return studentNames;
    } catch (error) {
        console.error(error);
        return { error: "Failed to fetch students" };
    }
};

const getMyCourses = async (studentId) => {
    try {
        const enrolledCourses = await Course.find({ "current_enroll.studentId": new Object(studentId) });
        const activeCourses = enrolledCourses.filter(course => new Date(course.date_end) > new Date());
        const result = [... new Set(activeCourses)]
        return result;
    } catch (error) {
        console.error(error);
        return { error: "Failed to fetch prices" };
    }
};

const getPriceForMyCourses = async (studentId) => {
    try {
        const enrolledCourses = await Course.find({ "current_enroll.studentId": new Object(studentId) });
        const activeCourses = enrolledCourses.filter(course => new Date(course.date_end) > new Date());
        const totalPrice = activeCourses.reduce((total, course) => total + course.price, 0);
        return totalPrice;
    } catch (error) {
        console.error(error);
        return { error: "Failed to calculate prices" };
    }
};




module.exports = { searchCourses, enrollStudent, unenrollStudent, getAvgStudentsAfterYear, getEnrollmentDatesByMonthAndYear, getStudentsAfterDate, getMyCourses, getPriceForMyCourses};
