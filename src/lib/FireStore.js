import Firebase from './Firebase';

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

  static getCollectionItemData(collection) {
    const items = [];
    collection.forEach((doc) => {
      items.push(FireStore.getDocData(doc));
    });

    return items;
  }

  /*
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
      let items = FireStore.getCollectionItemData(collection);

      let itemsResolvables = [];

      // If references are to be resolved
      if (references.length) {
        // Get item resolvables (Is that even a word? :/)
        itemsResolvables = FireStore.getItemsResolvables(items, references);
      } else {
        itemsResolvables.push(items);
      }

      // Promise that resolves with all the items
      return Promise.all(itemsResolvables).then((itemsResolved) => {
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
  static getItemsResolvables(items, references) {
    let itemResolvables = [];

    // Loop over all items
    items.forEach((item) => {
      // Get resolvable for each item and it's references
      let resolvable = FireStore.getReferencesResolvable(item, references);

      // Push a promise to itemResolvables that resolves
      // all the reference resolvables
      itemResolvables.push(resolvable);
    });

    return itemResolvables;
  }

  static getReferencesResolvable(item, references) {
    // Resolvables
    let resolvables = [];

    // Loop over all references to resolve
    references.forEach((ref) => {
      // If the item has ref property
      if (item.hasOwnProperty(ref)) {
        let docRef = item[ref];

        // Push a Promise to fetch data of the reference and when resolving,
        // swap the item's reference with the reference data.
        resolvables.push(FireStore.getReferenceResolvable(item, ref, docRef));
      }
    });

    return Promise.all(resolvables).then((res) => {
      return item;
    });
  }

  static getReferenceResolvable(item, ref, docReference) {
    return FireStore.fetchDataFromReference(docReference).then((refData) => {
      item[ref] = refData;
      return item;
    });
  }
}
