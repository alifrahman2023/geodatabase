import admin from "firebase-admin";

const serviceAccount = require("../../serviceAccountKey.json");

// init the app using the key.json from firebase console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// init the firestore database
const db = admin.firestore();