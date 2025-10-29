import { initializeApp } from 'firebase/app';
import { getDatabase, query, onValue, ref, update, onChildAdded, orderByChild, limitToFirst } from 'firebase/database';
import { getStorage, getDownloadURL, ref as stRef } from "firebase/storage";
import { getAuth, signInAnonymously } from 'firebase/auth';
import QRCode from 'qrcode';
import mailFormConfig from '../config/mailForm.json';
import placeholder from './placeholder.png';

console.log(mailFormConfig.firebase);
initializeApp(mailFormConfig.firebase);
const db = getDatabase();
const storage = getStorage()
const auth = getAuth();
let newItems = false;
let history = [];
let historyIndex = -1;

const setCode = (key, isNew) => {
      const url = `https://${mailFormConfig.firebase.authDomain}/?photoid=${key}`;
      console.log(url);
      QRCode.toCanvas(document.getElementById('canvas'), url, { width: 400 }, error => {
        if(!error) {
          document.getElementById('canvas').style.display = 'block';
          update(ref(db, 'photos/' + key), { showed: true });
        }
      });
      const photosRef = ref(db, `photos/${key}`);
      onValue(photosRef, (snapshot) => {
          let sval = snapshot.val()
          let text = isNew ? 'Nuevo ' : '';
          if (sval.timestamp) {
            text = text + sval.timestamp;
          }
          if (sval.prize) {
            text = text + ' (Premio, código ' + sval.prize.code + ')';
          } else {
            text = text + ' (sin premio)';
          }
          document.getElementById('info').innerText = text;
      });
      document.getElementById('photoimage').setAttribute('src', placeholder);
      getDownloadURL(stRef(storage, `/photos/${key}.jpg`)).then((url) => {
        document.getElementById('photoimage').setAttribute('src', url);
      }).catch(err => { console.log(err); });
};

signInAnonymously(auth).then(() => {
  console.log('Signed in');
  
  let previousQuery = query(ref(db, 'photos'), orderByChild('timestamp'), limitToFirst(100));
  onValue(previousQuery, snapshot => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      history.push(childKey);
    });
  });
  
  const prevButton = document.getElementById('back');
  const nextButton = document.getElementById('forward');

  prevButton.addEventListener('click', (ev) => {
    if (history.length == 0) {
      return;
    }
    if (historyIndex == -1) {
      historyIndex = history.length - 1;
    } else if (historyIndex > 0) {
      historyIndex -= 1;
    }
    setCode(history[historyIndex], false);
  });
  nextButton.addEventListener('click', (ev) => {
    if (history.length == 0) {
      return;
    }
    if (historyIndex == -1) {
      historyIndex = history.length - 1;
    } else if (historyIndex < (history.length - 1)) {
      historyIndex += 1;
    }
    setCode(history[historyIndex]);
  });

  const photosRef = ref(db, 'photos');
  onChildAdded(photosRef, data => {
    const value = data.val();
    console.log('value', value);
    setCode(data.key, true);
    if (history.indexOf(data.key) == -1) {
      history.push(data.key);
    }
  });
});
