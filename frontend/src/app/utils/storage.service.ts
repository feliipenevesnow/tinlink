import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage;


  constructor() { 
    this.storage = window.localStorage;
  }

  async set(key: string, value: any): Promise<boolean> {
    await this.reloadStorageIfNull();
    this.storage.setItem(key, JSON.stringify(value));
    return true;
  }

  async get(key: string): Promise<any> {
    await this.reloadStorageIfNull();
    let obj = this.storage.getItem(key);
    return obj;
  }

  async remove(key: string): Promise<boolean> {
    await this.reloadStorageIfNull();
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  async clear(): Promise<boolean> {
    await this.reloadStorageIfNull();
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }

  async reloadStorageIfNull() {
    if (this.storage == undefined || this.storage == null) {
     // const storage = await this.storage.create();
     // this.storage = storage;
    }
  }
}