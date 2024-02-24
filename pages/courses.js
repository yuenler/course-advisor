import { useEffect, useState } from 'react';
import { useAppContext } from './context/Context';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/router';

function Courses() {
  const [loading, setLoading] = useState(false);
  const [editState, setEditState] = useState({});
  const [editNames, setEditNames] = useState({}); // [semester-courseCode: newName]
  const { transcript, courses, setCourses } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!transcript) {
        router.push('/profile');
        return;
      }
      setLoading(true);

      const formData = new FormData();
      formData.append('file', transcript);
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    };

    fetchCourses();
  }, [transcript]);

  const analyzeConcentrationRequirements = () => {
    router.push('/fulfillment');
  }

  const toggleEdit = (semester, courseCode) => {
    const currentEditState = { ...editState };
    const editKey = `${semester}-${courseCode}`;
    currentEditState[editKey] = !currentEditState[editKey];
    setEditState(currentEditState);
  };

  const handleEdit = (semester, courseCode, newValue) => {
    const updatedCourses = { ...courses };
    const courseIndex = updatedCourses[semester].findIndex(course => course.code === courseCode);
    if (courseIndex !== -1) {
      updatedCourses[semester][courseIndex].name = newValue;
      setCourses(updatedCourses);
      toggleEdit(semester, courseCode); // Toggle off edit mode
    }
  };

  const handleDelete = (semester, courseCode) => {
    const updatedCourses = { ...courses };
    updatedCourses[semester] = updatedCourses[semester].filter(course => course.code !== courseCode);
    if (!updatedCourses[semester].length) delete updatedCourses[semester];
    setCourses(updatedCourses);
  };

  const handleAddCourse = (semester) => {
    const courseCode = prompt('Enter course code:');
    const courseName = prompt('Enter course name:');
    if (!courseCode || !courseName) return;

    const newCourse = { code: courseCode, name: courseName };
    const updatedCourses = { ...courses };
    if (!updatedCourses[semester]) {
      updatedCourses[semester] = [newCourse];
    } else {
      updatedCourses[semester].push(newCourse);
    }
    setCourses(updatedCourses);
  };

  const handleAddSemester = () => {
    const semesterName = prompt('Enter new semester name:');
    if (!semesterName) return;

    const updatedCourses = { ...courses };
    if (!updatedCourses[semesterName]) {
      updatedCourses[semesterName] = [];
      setCourses(updatedCourses);
    } else {
      console.log('Semester already exists.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center">
          <p className="text-lg font-semibold mb-2">Analyzing your transcript...</p>
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5" style={{ maxWidth: '60em' }}>
      <h1 className="text-2xl font-bold mb-4">Your Courses</h1>
      <div>
        <p
          className='text-lg mb-4'
        >
          Look at the courses extracted from your transcript. You can edit, delete, or add courses and semesters as needed. Once you've confirm your courses, you can proceed to the next step and see whether you have met your concentration requirements.
        </p>
        <button
          onClick={() => analyzeConcentrationRequirements()}
          className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Analyze Concentration Requirements
        </button>
      </div>
      <button
        onClick={handleAddSemester}
        className="mt-10 mb-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded"
      >
        Add Semester
      </button>
      {Object.keys(courses).length > 0 ? (
        Object.keys(courses).map((semester, semesterIndex) => (
          <div key={semester} className={`mb-8 ${semesterIndex > 0 ? 'mt-8' : ''}`}>
            <h2 className="text-xl font-semibold mb-2">{semester}</h2>
            <button
              onClick={() => handleAddCourse(semester)}
              className="mb-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
            >
              Add Course
            </button>
            <table className="min-w-full table-auto">
              <thead className="border-b">
                <tr>
                  <th className="text-left px-4 py-2">Code</th>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-right px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses[semester].map((course, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{course.code}</td>
                    <td className="px-4 py-2 w-2/3">
                      {editState[`${semester}-${course.code}`] ? (
                        <input
                          type="text"
                          defaultValue={course.name}
                          onChange={(e) => {
                            setEditNames({ ...editNames, [`${semester}-${course.code}`]: e.target.value })
                          }}
                          className="text-left rounded border-2 border-blue-500 w-full"
                          autoFocus
                        />
                      ) : (
                        course.name
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => {
                          if (editState[`${semester}-${course.code}`]) {
                            handleEdit(semester, course.code, editNames[`${semester}-${course.code}`]);
                          }
                          else {
                            toggleEdit(semester, course.code);
                            setEditNames({ ...editNames, [`${semester}-${course.code}`]: course.name });
                          }
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        {editState[`${semester}-${course.code}`] ? 'Save' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(semester, course.code)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No courses found. Please upload your transcript.</p>
      )}
      <button
        onClick={() => analyzeConcentrationRequirements()}
        className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Analyze Concentration Requirements
      </button>
    </div>
  );
}

export default Courses;
