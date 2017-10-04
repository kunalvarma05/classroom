import Firebase from './Firebase';
import Utils from "./Utils";

export default class FireStore {
  static instance() {
    return Firebase.instance().firestore();
  }

  static getDocData(doc, defaultValue = null) {
    if (doc.exists) {
      return doc.data();
    }

    return defaultValue;
  }

  static fetchDataFromReference(reference, defaultValue = null) {
    return reference.get().then((doc) => {
      return FireStore.getDocData(doc, defaultValue);
    });
  }

  static getCollectionItemsData(collection) {
    const items = [];
    collection.forEach((doc) => {
      items.push(FireStore.getDocData(doc));
    });

    return items;
  }

  /**
   * Now this method is a beauty. It takes a collection, then:
   * Fetches data of the items. If (item properties with reference)
   * references to resolve are given, it loops over all the items, and
   * for each item - it loops over all the references and pushes a Promise
   * to the resolvables array that fetches data for that reference and on success,
   * swaps the item property (reference) with the resolved refDoc and returns the item.
   * Then, this resolvables are resolved collectively and pushed to the itemResolvables array.
   *
   * Finally, a Promise resolving the itemResolvables array is returned, which on success,
   * returns all the items with resolved references. Magic, right? :p
   *
   * Oh, and if no references are given, it simply returns a promise that on resolving,
   * returns the items data. Phew.
   *
   * @param collection
   * @param {Array} references Name of properties, that contain a reference
   *                          to a document and must be resolved.
   *
   * @return {Promise}
   */
  static resolveCollectionItems(collection, references = []) {
    // I swear, I promise :p
    return new Promise((resolve, reject) => {
      // Collection is empty
      if (collection.empty) {
        resolve([]);
        return;
      }

      // Get collection items data
      let items = FireStore.getCollectionItemsData(collection);

      let resolvablesForItems = [];

      // If references are to be resolved
      if (references.length) {
        // Get item resolvables (Is that even a word? :/)
        resolvablesForItems = FireStore.getResolvablesForItems(items, references);
      } else {
        // No references to resolve.
        resolvablesForItems.push(items);
      }

      // Promise that resolves with all the items
      return Promise.all(resolvablesForItems).then((itemsResolved) => {
        resolve(itemsResolved);
      });
    });
  }

  /**
   * Get item Resolvables. What?
   * An array of Promises that all resolve the references
   * of each individual item.
   *
   * @param items
   * @param references
   */
  static getResolvablesForItems(items, references) {
    // This will be an array containing the
    // resolvables (Promises) of all the items.
    let itemResolvables = [];

    // Loop over all items
    items.forEach((item) => {
      // Get resolvable for each item and it's references
      let resolvable = FireStore.getResolvablesForItem(item, references);

      // Push a promise to itemResolvables that resolves
      // all the reference resolvables
      itemResolvables.push(resolvable);
    });

    return itemResolvables;
  }

  /**
   * Get all resolvables for the given references of the item.
   *
   * @param item
   * @param {Array} references
   * @return {Promise}
   */
  static getResolvablesForItem(item, references) {
    // This will be an array containing all the resolvables
    // (Promises) of the item references (Properties) passed.
    let resolvables = [];

    // If the references is an number we will loop through it.
    // This is in case we're handling an item that is an array.
    // Thus, it's index are the references.
    if (typeof references === "number") {
      for (let i = 0; i < references; i++) {
        resolvables.push(FireStore.getResolvableForItemReference(item, i));
      }
    } else {
      // Loop over all references (items) to resolve
      references.forEach((ref) => {
        resolvables.push(FireStore.getResolvableForItemReference(item, ref));
      });

    }

    return Promise.all(resolvables).then((res) => {
      return item;
    });
  }

  // Get resolvable for the given reference
  static getResolvableForItemReference(item, ref) {
    let resolvables = [];

    // If the item has ref property
    if (item.hasOwnProperty(ref)) {
      let itemRef = item[ref];

      // If the Item Ref is iterable
      if (Utils.isIterable(itemRef)) {
        // Push a Promise to fetch data of the reference and when resolving,
        // swap the item's reference with the reference data.
        resolvables.push(FireStore.getResolvablesForItem(itemRef, itemRef.length));
      } else {
        // Push a Promise to fetch data of the reference and when resolving,
        // swap the item's reference with the reference data.
        resolvables.push(FireStore.getResolvableForReference(item, ref, itemRef));
      }
    }

    return resolvables;
  }

  /**
   *
   * @param item
   * @param ref
   * @param docReference
   */
  static getResolvableForReference(item, ref, docReference) {
    return FireStore.fetchDataFromReference(docReference).then((refData) => {
      item[ref] = refData;
      return item;
    });
  }
}
