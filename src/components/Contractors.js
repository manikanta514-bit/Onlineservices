import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { db, storage } from "../context/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { FaStar } from "react-icons/fa";
import { BookingContext } from "../context/BookingContext"; // import context

const Contractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bookings } = useContext(BookingContext);

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

    const unsubscribe = onSnapshot(
      contractorsRef,
      async (snapshot) => {
        if (!snapshot.empty) {
          const data = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const worker = { id: doc.id, ...doc.data() };

              if (worker.beforeafter) {
                const beforeVal = worker.beforeafter.before;
                const afterVal = worker.beforeafter.after;

                if (beforeVal) {
                  if (isURL(beforeVal)) {
                    worker.beforeafter.beforeURL = beforeVal;
                  } else {
                    try {
                      worker.beforeafter.beforeURL = await getDownloadURL(
                        ref(storage, `contractors/${worker.id}/before/${beforeVal}`)
                      );
                    } catch {
                      worker.beforeafter.beforeURL = null;
                    }
                  }
                }

                if (afterVal) {
                  if (isURL(afterVal)) {
                    worker.beforeafter.afterURL = afterVal;
                  } else {
                    try {
                      worker.beforeafter.afterURL = await getDownloadURL(
                        ref(storage, `contractors/${worker.id}/after/${afterVal}`)
                      );
                    } catch {
                      worker.beforeafter.afterURL = null;
                    }
                  }
                }
              }

              return worker;
            })
          );

          setContractors(data);
        } else {
          setContractors([]);
        }
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

  if (loading) return <p>Loading contractors...</p>;

  const categories = {};
  contractors.forEach((c) => {
    const cat = normalizeCategory(c.category);
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(c);
  });

  const sortedCategories = desiredOrder.filter((c) => categories[c]);

  return (
    <div className="guys-detail">
      <h1>Our Skilled Contractors</h1>
      <p>
        Browse our professional contractors across various categories. Click on a contractor to view more details and reviews.
      </p>

      {sortedCategories.map((category) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>

          <div className="guys-grid">
            {categories[category].map((worker) => (
              <div key={worker.id} className="guys-card">
                <div className="logo-container">
                  <img src={worker.img || ""} alt={worker.name || "Contractor"} className="service-logo" />
                </div>

                <div className="card-info" style={{ flexGrow: 1 }}>
                  <h3>{worker.name || "No Name"}</h3>
                  <p><b>Skill:</b> {worker.skill || "N/A"}</p>
                  <p><b>Experience:</b> {worker.exp || "N/A"}</p>
                  <p className="guys-price"><b>Charges:</b> {worker.charges || "N/A"}</p>
                  <p className="star-rating">
                    <b>Rating:</b>{" "}
                    {[...Array(Math.round(worker.rating || 0))].map((_, i) => (
                      <FaStar key={i} style={{ color: "gold" }} />
                    ))}
                    {worker.rating ? ` ${worker.rating}/5` : " N/A"}
                  </p>
                  <p><b>Reviews:</b> {worker.reviews?.length || 0}</p>
                </div>

                <Link to={`/contractors/${worker.id}`} className="guys-btn">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contractors;
