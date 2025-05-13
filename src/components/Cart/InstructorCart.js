const InstructorCourseCard = ({ course }) => {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>
        <strong>Enrolled Students:</strong> {course.enrolledCount}
      </p>
      <button>Edit Course</button>
    </div>
  );
};

export default InstructorCourseCard;
