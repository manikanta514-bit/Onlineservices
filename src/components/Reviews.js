import React from "react";
import { workersData } from "./workersData";
import { FaStar } from "react-icons/fa";
import "../App.css";

const Reviews = () => {
  const categories = Object.keys(workersData);

  // Function to generate random rating between 4 and 5 (1 decimal)
  const getRandomRating = () => {
    return Math.round((4 + Math.random()) * 10) / 10; // 4.0 to 5.0
  };

  return (
    <div className="mani-reviews-container">
      <h1 className="mani-reviews-title">Reviews</h1>

      {categories.map((category) => (
        <div key={category} className="mani-category-section">
          <h2 className="mani-category-title">{category}</h2>

          {workersData[category].map((contractor) => {
            const stars = getRandomRating(); // Random rating for each contractor

            return (
              <div key={contractor.id} className="mani-contractor-card">
                <h3 className="mani-contractor-name">{contractor.name}</h3>

                {/* Star rating for all contractors */}
                <div className="mani-review-stars" style={{ marginBottom: "10px" }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < Math.floor(stars) ? "gold" : i < stars ? "gold" : "#ccc"}
                    />
                  ))}
                  {stars ? ` ${stars}/5` : ""}
                </div>

                {/* Reviews */}
                {(contractor.reviews && contractor.reviews.length > 0) ? (
                  contractor.reviews.map((review, idx) => (
                    <div key={idx} className="mani-review-card">
                      <div className="mani-review-header">
                        <strong className="mani-review-user">{review.user}</strong>
                      </div>
                      <p className="mani-review-comment">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="mani-no-reviews">No reviews yet.</p>
                )}

                {/* Before/After Images */}
                {contractor.beforeafter && (
                  <div className="mani-before-after-container">
                    <div className="mani-before">
                      <p className="mani-before-label">Before</p>
                      <img
                        src={contractor.beforeafter.before}
                        alt={`Before ${contractor.name}`}
                        className="mani-before-img"
                      />
                    </div>
                    <div className="mani-after">
                      <p className="mani-after-label">After</p>
                      <img
                        src={contractor.beforeafter.after}
                        alt={`After ${contractor.name}`}
                        className="mani-after-img"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Reviews;
