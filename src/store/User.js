import BaseStore from "./BaseStore";

class UserStore extends BaseStore {
  constructor() {
    super();
    this.collectionName = "users";
    UserStore.instanceObj = false;
  }

  static instance() {
    if (!UserStore.instanceObj) {
      UserStore.instanceObj = new UserStore();
    }

    return UserStore.instanceObj;
  }
}

export default UserStore.instance();
