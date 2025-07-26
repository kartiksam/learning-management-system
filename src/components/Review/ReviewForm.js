import React, { useState } from "react";
import axios from "axios";
import "./ReviewForm.css";

const ReviewForm = ({ courseId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      `/api/reviews/${courseId}`,
      { review, rating },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Review submitted!");
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        required
      />
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
