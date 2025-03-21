import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './CourseStats.css'
import { getCourseById, getCourseAvgByYear, getDatesByMonthAndYear, getStudentsByDayAndMonthAndYear } from '../../services/CoursesServices';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CourseStats = () => {
  const { id } = useParams();
  const [courseTitle, setCourseTitle] = useState('');
  const [, setCourse] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState([]);

  const fetchData = async () => {
    if (id) {
      const cours = await getCourseById(id);
      setCourse(cours);
      setCourseTitle(cours.name);
      const result = await getCourseAvgByYear(id, year);
      setData(result);
      const month = selectedDate.getMonth() + 1;
      const datesAfterMonth = await getDatesByMonthAndYear(id, month, year);
      setHighlightedDates(datesAfterMonth.map(date => new Date(date).toISOString().split('T')[0]))
    }
  };

  const featDate = async (date) => {
    const dateFormated = new Date(date);
    setSelectedDate(dateFormated); 
    setYear(dateFormated.getFullYear()); 
    const result = await getStudentsByDayAndMonthAndYear(id, dateFormated.getDate(), dateFormated.getMonth() + 1, dateFormated.getFullYear());
    setStudents(result); 
  }

  useEffect(() => {
    fetchData();
  }, [id, year, selectedDate])

  useEffect(() => {
    featDate(new Date());
  },[])

  const handleDateChange = (date) => {
    featDate(date);
  };

  const getTileClassName = ({ date }) => {
    const dateString = date.toISOString().split('T')[0]; 
    if (highlightedDates.includes(dateString)) {
      return 'highlighted-date';
    }
    return null;
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: `Average Students in ${year}`,
        data: data.length === 12 ? data : Array(12).fill(0), 
        backgroundColor: '#ABB777', 
        borderColor: '#ABB777',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        labels: {
          color: '#F9F9F9', 
        },
      },
      tooltip: {
        titleColor: '#F9F9F9',
        bodyColor: '#F9F9F9',
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#F9F9F9', 
        },
        display: false,
      },
      x: {
        ticks: {
          color: '#F9F9F9',
        },
        grid: {
          display: false, 
        },
      },
    },
    backgroundColor: 'transparent', 
  };

  return (
    <div className='container'>
      <h1>{courseTitle || "Loading..."}</h1>


    <div className='chart'>
        <Bar data={chartData} options={chartOptions} />
    </div>

    <div className='container-calendar'>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate} 
        tileClassName={getTileClassName}
      />

        <div className='list-students'>
            <h3>Students Enrolled: {selectedDate.toDateString()}</h3>
            <div className="students-list-container">
                <ul>
                {students.length > 0 ? (
                    students.map((student, index) => (
                    <li key={index}>{student}</li>
                    ))
                ) : (
                    <li>No students enrolled after this date.</li>
                )}
                </ul>
            </div>
        </div>
    </div>

    </div>
  )
}

export default CourseStats;
