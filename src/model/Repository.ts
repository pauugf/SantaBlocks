import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, set, onValue, Database, update } from 'firebase/database';
import { getStorage, ref, uploadBytes, FirebaseStorage } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { v4 } from 'uuid';

export default class Repository {
  private storage: FirebaseStorage;
  private db: Database;

  constructor(config: any) {
    const app = initializeApp(config);
    this.storage = getStorage(app);
    this.db = getDatabase();
    const auth = getAuth();
    signInAnonymously(auth).then(() => {
      console.log('Signed in');
    });
  }

  save(file: Blob, prize: any): Promise<any> {
    const self = this;
    return new Promise((resolve) => {
      const id = v4();
      const fileRef = ref(self.storage, 'photos/' + id + '.jpg');
      uploadBytes(fileRef, file).then(() => {
        console.log('File uploaded: ' + id, prize);
        set(dbRef(self.db, 'photos/' + id), {
          sent: false,
          prize: prize
        })
        .then(() => {
          resolve(id);
        })
      });
    });
  }

  getPlayersCount() {
    return new Promise((resolve) => {
      const ref = dbRef(this.db, 'playersCount');
      onValue(ref, snapshot => {
        const value = snapshot.val();
        resolve(value);
      });
    });
  }

  setPlayersCount(value: number) {
    set(dbRef(this.db, 'playersCount'), value).then(() => console.log('playersCount set to ' + value));
  }
}