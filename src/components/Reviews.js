import React, { useState, useEffect, useContext } from "react";
import { db, storage } from "../context/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { FaStar } from "react-icons/fa";
import { BookingContext } from "../context/BookingContext";
import "../App.css";

const Reviews = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line no-unused-vars
  const { bookings } = useContext(BookingContext); // keep for context, no changes

  const desiredOrder = [
    "Cleaning",
    "Repairs",
    "Installations",
    "Painting",
    "Packers and Movers",
    "Uncategorized",
  ];

  const normalizeCategory = (cat) => {
    if (!cat) return "Uncategorized";
    const lower = cat.toLowerCase();
    if (lower.includes("cleaning")) return "Cleaning";
    if (lower.includes("repair")) return "Repairs";
    if (lower.includes("install")) return "Installations";
    if (lower.includes("paint")) return "Painting";
    if (lower.includes("pack")) return "Packers and Movers";
    return cat;
  };

  const isURL = (str) => str && (str.startsWith("http://") || str.startsWith("https://"));

  useEffect(() => {
    const contractorsRef = collection(db, "contractors");
    const q = query(contractorsRef);

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const data = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const contractor = { id: doc.id, ...doc.data() };

            if (contractor.beforeafter) {
              const beforeVal = contractor.beforeafter.before;
              const afterVal = contractor.beforeafter.after;

              if (beforeVal) {
                if (isURL(beforeVal)) {
                  contractor.beforeafter.beforeURL = beforeVal;
                } else {
                  try {
                    contractor.beforeafter.beforeURL = await getDownloadURL(
                      ref(storage, `contractors/${contractor.id}/before/${beforeVal}`)
                    );
                  } catch {
                    contractor.beforeafter.beforeURL = null;
                  }
                }
              }

              if (afterVal) {
                if (isURL(afterVal)) {
                  contractor.beforeafter.afterURL = afterVal;
                } else {
                  try {
                    contractor.beforeafter.afterURL = await getDownloadURL(
                      ref(storage, `contractors/${contractor.id}/after/${afterVal}`)
                    );
                  } catch {
                    contractor.beforeafter.afterURL = null;
                  }
                }
              }
            }

            return contractor;
          })
        );

        setContractors(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setContractors([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading reviews...</p>;

  const categories = {};
  contractors.forEach((c) => {
    const cat = normalizeCategory(c.category);
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(c);
  });

  const sortedCategories = desiredOrder.filter((c) => categories[c]);

  return (
    <div className="mani-reviews-container">
      <h1 className="mani-reviews-title">Contractor Reviews & Work Samples</h1>

      {sortedCategories.map((category) => (
        <div key={category}>
          <h2 style={{ marginTop: "20px" }}>{category}</h2>

          {categories[category].map((contractor) => (
            <div key={contractor.id} className="mani-contractor-card">
              <h3 className="mani-contractor-name">{contractor.name || "No Name"}</h3>

              <div className="mani-review-stars" style={{ marginBottom: "10px" }}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < Math.floor(contractor.rating || 0) ? "gold" : "#ccc"} />
                ))}
                {contractor.rating ? ` ${contractor.rating}/5` : ""}
              </div>

              {contractor.reviews?.length > 0 ? (
                <ul className="mani-review-list">
                  {contractor.reviews.map((review, idx) => (
                    <li key={idx} className="mani-review-item">
                      <strong>{review.user}</strong>{" "}
                      {review.stars ? (
                        <span style={{ color: "gold" }}><FaStar /> {review.stars}</span>
                      ) : (
                        <FaStar style={{ color: "lightgray" }} />
                      )}
                      : {review.comment}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mani-no-reviews">No reviews yet.</p>
              )}

              {contractor.beforeafter?.beforeURL && contractor.beforeafter?.afterURL && (
                <div className="mani-before-after-container" style={{ marginTop: "15px" }}>
                  <div className="mani-before">
                    <p className="mani-before-label">Before</p>
                    <img src={contractor.beforeafter.beforeURL} alt={`Before ${contractor.name}`} className="mani-before-img" />
                  </div>
                  <div className="mani-after">
                    <p className="mani-after-label">After</p>
                    <img src={contractor.beforeafter.afterURL} alt={`After ${contractor.name}`} className="mani-after-img" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Reviews;
