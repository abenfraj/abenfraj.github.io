import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase-config";

export const saveUserPreferences = async (userId, preferences) => {
  if (!userId) return;

  const userPreferencesDoc = doc(db, "userSettings", userId);
  await setDoc(userPreferencesDoc, preferences, { merge: true });
};

export const loadUserPreferences = async (userId, callback, dataKey) => {
  if (!userId) {
    console.log("No user ID provided");
    return;
  }

  const userPreferencesDoc = doc(db, "userSettings", userId);

  onSnapshot(userPreferencesDoc, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (dataKey in data) {
        callback(data[dataKey]);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
