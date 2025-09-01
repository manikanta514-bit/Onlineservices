// Use CommonJS style imports
const { adminDB } = require("../context/firebaseAdmin.js");
const { workersData } = require("./workersData.js");

async function uploadContractors() {
  try {
    console.log("Starting upload of contractors...");

    // Loop through categories
    for (const category in workersData) {
      console.log(`Processing category: ${category}`);
      const contractorsArray = workersData[category];

      for (const contractor of contractorsArray) {
        const contractorRef = adminDB.collection("contractors").doc(contractor.id);

        const contractorData = {
          id: contractor.id,
          name: contractor.name,
          skill: contractor.skill,
          exp: contractor.exp,
          charges: contractor.charges,
          img: contractor.img,
          rating: contractor.rating,
          category: category,
          reviews: contractor.reviews || [],
          beforeafter: contractor.beforeafter || null,
        };

        await contractorRef.set(contractorData);
        console.log(`Uploaded contractor: ${contractor.name}`);
      }
    }

    console.log("All contractors uploaded successfully!");
  } catch (error) {
    console.error("Error uploading contractors:", error);
  }
}

// Run the uploader
uploadContractors();
