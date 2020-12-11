import firebase from "firebase";


const firebaseapp=firebase.initializeApp(
{
  //Add Your Firebase Project details
  }
  );

  const db=firebaseapp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export {db,auth,storage};
