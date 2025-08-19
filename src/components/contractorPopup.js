import React from "react";
import { X } from "lucide-react";
import ReactCompareImage from "react-compare-image";

const ContractorPopup = ({ contractor, onClose }) => {
  if (!contractor) return null;

  const beforeImage = contractor.beforeAfter?.before || "/images/default-before.jpg";
  const afterImage = contractor.beforeAfter?.after || "/images/default-after.jpg";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-lg relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <X size={22} />
      </button>

      {/* Contractor Profile */}
      <div className="flex items-center gap-4">
        <img
          src={contractor.img || "/images/default.png"}
          alt={contractor.name || "Unknown Contractor"}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          {contractor.id && <p className="text-xs text-gray-400 mb-1">ID: {contractor.id}</p>}
          {contractor.category && <p className="text-sm text-gray-500 mb-1">Category: {contractor.category}</p>}
          <h2 className="text-xl font-bold">{contractor.name || "Unknown Contractor"}</h2>
          <p className="text-gray-600">{contractor.skill || "Not specified"}</p>
          <p className="text-sm text-gray-500">{contractor.exp || "Not specified"}</p>
          <p className="font-semibold mt-1">{contractor.charges || "N/A"}</p>

          {/* Rating */}
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-lg ${i < contractor.rating ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-500">{contractor.reviews?.length || 0} reviews</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {contractor.reviews?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700">Reviews</h3>
          <div className="max-h-32 overflow-y-auto mt-2 space-y-2">
            {contractor.reviews.map((review, index) => (
              <p key={index} className="text-sm text-gray-600">
                • {review}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Before & After Work */}
      <div className="mt-5">
        <h3 className="font-semibold text-gray-700 mb-2">Before & After Work</h3>
        <ReactCompareImage
          leftImage={beforeImage}
          rightImage={afterImage}
          sliderLineColor="#f59e0b"
          handle={<div className="w-4 h-4 rounded-full bg-yellow-500 shadow-md" />}
        />
      </div>
    </div>
  );
};

export default ContractorPopup;
