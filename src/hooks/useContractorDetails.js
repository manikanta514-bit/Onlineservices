// src/hooks/useContractorDetails.js
import { useCallback } from "react";
import { db } from "../context/firebase";
import { doc, getDoc } from "firebase/firestore";

const useContractorDetails = () => {
  const getContractorById = useCallback(async (contractorId) => {
    if (!contractorId) return null;

    try {
      const contractorRef = doc(db, "contractors", contractorId);
      const contractorSnap = await getDoc(contractorRef);

      if (contractorSnap.exists()) {
        return { id: contractorSnap.id, ...contractorSnap.data() };
      } else {
        console.warn("No contractor found with ID:", contractorId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching contractor:", error);
      return null;
    }
  }, []);

  return { getContractorById };
};

export default useContractorDetails;
