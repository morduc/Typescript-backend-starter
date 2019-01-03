export interface ICouchDBStore {
  getValue(key: string): Promise<any>;
  setValue(key: string, value: any): Promise<any>;
  find(query:any): Promise<any>;
  deleteValue(key: string): Promise<any>;
  setupDB(): Promise<ICouchDBStore>
} 