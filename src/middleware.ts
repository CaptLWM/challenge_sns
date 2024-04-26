// 사용불가, 사용되는 측이 다름
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { NextResponse } from "next/server";

// export async function middleware() {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (user) {
//     return NextResponse.next();
//   } else {
//     return NextResponse.redirect("http://localhost:3000/i/flow/login");
//   }
// }

// export const config = {
//   matcher: ["/compose/tweet", "/home", "/explore", "/message", "/search"],
// };
