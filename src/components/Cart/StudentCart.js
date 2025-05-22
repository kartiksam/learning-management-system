const StudentCourseCard = ({ course }) => {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>
        <strong>Instructor:</strong> {course.instructorName}
      </p>
      <button>Enrolled in Course</button>
    </div>
  );
};

export default StudentCourseCard;
