import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  // Set a value in local storage
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  setJsonItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Get a value from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
  getJsonItem(key: string): any | null {
    const ret = localStorage.getItem(key);
    if (ret) {
      return JSON.parse(ret);
    } else {
      return null;
    }
  }
  getAll() {
    var archive = [],
      keys = Object.keys(localStorage),
      i = 0, key;
    for (; key = keys[i]; i++) {
      let k: any = {};
      k[key] = localStorage.getItem(key);
      archive.push(k);
    }
    return archive;
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }
}
