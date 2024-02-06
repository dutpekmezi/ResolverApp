import * as admin from 'firebase-admin';
import serviceAccount from '../../resolver-29d0f-firebase-adminsdk-a750j-7a17f93650.json';

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: 'gs://resolver-29d0f.appspot.com', // Replace with your bucket name
  });
}

const bucket = admin.storage().bucket();

export { admin, bucket };