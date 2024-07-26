// firebaseConfig.js
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: 'AIzaSyAH-IbD8gBHVYnKuvIQori786sUogk9sK8',
  authDomain: 'phattriencanhan-ed74b.firebaseapp.com',
  projectId: 'phattriencanhan-ed74b',
  storageBucket: 'phattriencanhan-ed74b.appspot.com',
  messagingSenderId: '843833172777',
  appId: '1:843833172777:android:339127554b97523e398d38',
};

// Kiểm tra và khởi tạo Firebase nếu chưa được khởi tạo
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase đã được khởi tạo với cấu hình:", firebaseConfig);
} else {
  console.log("Firebase đã được khởi tạo trước đó.");
}

export { auth };
