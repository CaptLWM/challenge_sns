import { getStorage } from "firebase/storage";
import firebasedb from "./firebase";

export const storage = getStorage(firebasedb);
