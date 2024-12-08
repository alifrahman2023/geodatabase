import admin from "firebase-admin";

// path.resolve needed for ensuring that the correct file is loaded
// no matter where the script is ran from
const serviceAccount = require("../../serviceAccountKey.json");

// init the app using the key.json from firebase console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// init the firestore database
const db = admin.firestore();
