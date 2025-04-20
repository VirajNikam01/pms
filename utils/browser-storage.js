export async function clearAllBrowserStorage() {
    // Clear IndexedDB
    if ('indexedDB' in window && indexedDB.databases) {
      const dbs = await indexedDB.databases();
      dbs.forEach((db) => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
          console.log(`Deleted IndexedDB: ${db.name}`);
        }
      });
    } else {
      console.warn('indexedDB.databases() not supported in this browser');
    }
  
    // Clear LocalStorage
    localStorage.clear();
    console.log('Cleared localStorage');
  
    // Clear SessionStorage
    sessionStorage.clear();
    console.log('Cleared sessionStorage');
  
    // Clear Cache Storage
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          console.log(`Deleting cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
      console.log('Cleared all Cache Storage');
    } else {
      console.warn('Cache API not supported in this browser');
    }
  
    console.log('✅ All browser storage cleared');
  }
  