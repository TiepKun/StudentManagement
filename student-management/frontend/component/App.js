import axios from 'axios';
import React, { useEffect, useState } from 'react';
import StudentList from './StudentList';

const App = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <h1>Student Management</h1>
      <StudentList students={students} />
    </div>
  );
}