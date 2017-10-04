import ENV from '../env'

const libFirebase = require('firebase');
// Required for side-effects
require("firebase/firestore");

export default class Firebase {

  constructor(firebaseApp) {
    this.app = firebaseApp;
  }

  /**
   * Firebase Configuration.
   *
   * @returns {{
   *   apiKey: (string|string),
   *   authDomain: (string|string),
   *   databaseURL: (string|string),
   *   projectId: (string|string),
   *   storageBucket: (string|string),
   *   messagingSenderId: (string|string)
   * }}
   */
  static getConfig() {
    return {
      apiKey: ENV.firebase.apiKey,
      authDomain: ENV.firebase.authDomain,
      databaseURL: ENV.firebase.databaseURL,
      projectId: ENV.firebase.projectId,
      storageBucket: ENV.firebase.storageBucket,
      messagingSenderId: ENV.firebase.messagingSenderId
    };
  }

  /**
   * Initialize Firebase.
   *
   * @returns {Firebase}
   */
  static init() {
    const firebaseApp = libFirebase.initializeApp(Firebase.getConfig());
    Firebase.objInstance = new Firebase(firebaseApp);
    return Firebase.objInstance;
  }

  /**
   * Get Instance.
   * @returns {Firebase}
   */
  static instance() {
    if (Firebase.objInstance) {
      return Firebase.objInstance;
    }

    return Firebase.init();
  }

  /**
   * Get the Firebase client
   */
  static getClient() {
    return libFirebase;
  }

  /**
   * Get the Firebase database Instance.
   */
  database() {
    return this.app.database();
  }

  /**
   * Get the Firebase authInstance.
   */
  auth() {
    return this.app.auth();
  }

  /**
   * Get the Firebase storage Instance.
   */
  storage() {
    return this.app.storage();
  }

  /**
   * Get Firestore
   * @returns {*|firebase.firestore.Firestore}
   */
  firestore() {
    return this.app.firestore();
  }

}
