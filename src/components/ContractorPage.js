import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db, storage } from "../context/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { FaStar } from "react-icons/fa";
import ReactCompareImage from "react-compare-image";

const ContractorPage = () => {
  const { id } = useParams();
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);

  const isURL = (str) => str && (str.startsWith("http://") || str.startsWith("https://"));

  useEffect(() => {
    const fetchContractor = async () => {
      const docRef = doc(db, "contractors", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.beforeafter) {
          const beforeVal = data.beforeafter.before;
          const afterVal = data.beforeafter.after;

          if (beforeVal) {
            if (isURL(beforeVal)) {
              data.beforeafter.beforeURL = beforeVal;
            } else {
              try {
                data.beforeafter.beforeURL = await getDownloadURL(
                  ref(storage, `contractors/${id}/before/${beforeVal}`)
                );
              } catch {
                data.beforeafter.beforeURL = null;
              }
            }
          }

          if (afterVal) {
            if (isURL(afterVal)) {
              data.beforeafter.afterURL = afterVal;
            } else {
              try {
                data.beforeafter.afterURL = await getDownloadURL(
                  ref(storage, `contractors/${id}/after/${afterVal}`)
                );
              } catch {
                data.beforeafter.afterURL = null;
              }
            }
          }
        }

        setContractor(data);
      } else {
        setContractor(null);
      }
      setLoading(false);
    };

    fetchContractor();
  }, [id]);

  if (loading) return <p>Loading contractor details...</p>;
  if (!contractor) return <p className="text-center mt-10">Contractor not found</p>;

  return (
    <div className="contractor-page-container">
      <h1>{contractor.name}</h1>

      {/* Contractor Details */}
      <div className="details-section">
        <img src={contractor.img} alt={contractor.name} className="worker-img" />
        <div className="details-text">
          <p><b>Skill:</b> {contractor.skill}</p>
          <p><b>Experience:</b> {contractor.exp}</p>
          <p><b>Charges:</b> {contractor.charges}</p>
          <p><b>Rating:</b>{" "}
            {[...Array(Math.round(contractor.rating || 0))].map((_, i) => (
              <FaStar key={i} style={{ color: "gold" }} />
            ))} {contractor.rating || "N/A"}/5
          </p>
          <p><b>Category:</b> {contractor.category}</p>
        </div>
      </div>

      {/* Before/After Images */}
      {contractor.beforeafter?.beforeURL && contractor.beforeafter?.afterURL && (
        <div className="before-after-section" style={{ marginTop: "30px" }}>
          <h2 style={{ color: "gold", textAlign: "center", marginBottom: "15px" }}>Before & After Work</h2>
          <ReactCompareImage
            leftImage={contractor.beforeafter.beforeURL}
            rightImage={contractor.beforeafter.afterURL}
            sliderLineColor="gold"
          />
        </div>
      )}

      {/* Reviews */}
      <div className="reviews-section" style={{ marginTop: "30px" }}>
        <h2>Reviews</h2>
        {contractor.reviews?.length > 0 ? (
          <ul>
            {contractor.reviews.map((review, i) => (
              <li key={i}>
                <strong>{review.user}</strong>{" "}
                {[...Array(review.stars || 0)].map((_, i) => (
                  <FaStar key={i} style={{ color: "gold" }} />
                ))}
                {review.stars ? ` ${review.stars}/5` : ""}: {review.comment}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Link to="/contractors" className="guys-btn">Back to Contractors</Link>
      </div>
    </div>
  );
};

export default ContractorPage;
