// CommonJS style for Node v22
const admin = require("firebase-admin");
const fs = require("fs");

// Read service account JSON
const serviceAccount = JSON.parse(fs.readFileSync(__dirname + "/serviceAccountKey.json", "utf8"));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "online-services-4e3ab.appspot.com", // optional
  });
}

// Export Firestore and Storage
const adminDB = admin.firestore();
const adminStorage = admin.storage().bucket();

module.exports = { adminDB, adminStorage };
