import { getAuth } from "firebase/auth";
import firebasedb from "./firebase";

const auth = getAuth(firebasedb);
export default auth;
