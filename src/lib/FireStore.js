import Firebase from './Firebase';

export default class FireStore {
  static instance() {
    return Firebase.instance().firestore();
  }
}
