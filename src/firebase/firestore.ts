import { getFirestore } from "firebase/firestore";
import firebasedb from "./firebase";

const firestore = getFirestore(firebasedb);
export default firestore;
