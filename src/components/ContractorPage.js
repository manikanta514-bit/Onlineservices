import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ReactCompareImage from "react-compare-image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../context/firebase";
import workersData from "./workersData";
import "../App.css";

const ContractorPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState(location.state?.contractor || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        let fetchedContractor = location.state?.contractor || null;

        if (!fetchedContractor) {
          // Try Firestore first
          const docRef = doc(db, "contractors", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            fetchedContractor = { id: docSnap.id, ...docSnap.data() };
          } else {
            // Fallback to workersData
            const allWorkers = Object.values(workersData).flat();
            const fallback = allWorkers.find((w) => w.id === id);
            fetchedContractor = fallback || {};
          }
        }

        // Merge with defaults so all fields exist
        const defaultContractor = {
          id,
          name: "Unknown Contractor",
          skill: "-",
          exp: "-",
          charges: "-",
          img: "/images/default.png",
          beforeAfter: { before: "/images/default-before.jpg", after: "/images/default-after.jpg" },
          rating: 0,
          reviews: [],
        };

        setContractor({ ...defaultContractor, ...fetchedContractor });
      } catch (error) {
        console.error("Error fetching contractor:", error);
        setContractor({
          id,
          name: "Unknown Contractor",
          skill: "-",
          exp: "-",
          charges: "-",
          img: "/images/default.png",
          beforeAfter: { before: "/images/default-before.jpg", after: "/images/default-after.jpg" },
          rating: 0,
          reviews: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContractor();
  }, [id, location.state]); // ✅ contractor removed from dependencies

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading contractor...</p>
      </div>
    );
  }

  const beforeImage = contractor.beforeAfter?.before || "/images/default-before.jpg";
  const afterImage = contractor.beforeAfter?.after || "/images/default-after.jpg";
  const rating = contractor.rating || 0;
  const reviews = contractor.reviews || [];

  return (
    <div className="container mx-auto p-6 flex flex-col min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-lg contractor-card flex-1">
        <div className="flex items-center gap-4">
          <img
            src={contractor.img || "/images/default.png"}
            alt={contractor.name}
            className="w-20 h-20 rounded-full object-cover contractor-img"
          />
          <div>
            <h2 className="text-xl font-bold">{contractor.name}</h2>
            <p className="text-gray-600">{contractor.skill || "-"}</p>
            <p className="text-sm text-gray-500">{contractor.exp || "-"}</p>
            <p className="font-semibold mt-1">{contractor.charges || "-"}</p>

            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`text-lg ${i < rating ? "text-yellow-500" : "text-gray-300"}`}>★</span>
              ))}
              <span className="ml-2 text-sm text-gray-500">{reviews.length} reviews</span>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 section-title">Reviews</h3>
            <div className="max-h-32 overflow-y-auto mt-2 space-y-2 review-scroll">
              {reviews.map((review, index) => (
                <p key={index} className="text-sm text-gray-600">• {review}</p>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <h3 className="font-semibold text-gray-700 section-title mb-2">Before & After Work</h3>
          <ReactCompareImage
            leftImage={beforeImage}
            rightImage={afterImage}
            sliderLineColor="#f59e0b"
            handle={<div className="w-4 h-4 rounded-full bg-yellow-500 shadow-md rci-handle" />}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 rounded back-btn">
          Back
        </button>
      </div>
    </div>
  );
};

export default ContractorPage;
