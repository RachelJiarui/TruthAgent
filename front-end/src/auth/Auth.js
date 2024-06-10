// import React, { useState } from 'react';
// import { auth } from '../config/firebase-config.js';
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// const Auth = () => {
//   const [user, setUser] = useState(null);

//   const signInWithGoogle = () => {
//     const provider = new GoogleAuthProvider();
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         const user = result.user;
//         setUser(user);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   return (
//     <div>
//       {user ? (
//         <div>
//           <h1>Welcome</h1>
//         </div>
//       ) : (
//         <button onClick={signInWithGoogle}>Sign in with Google</button>
//       )}
//     </div>
//   );
// };

// export default Auth;
