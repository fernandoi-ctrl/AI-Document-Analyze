export interface StoredObject {
  key: string;
  contentType: string;
  size: number;
}

export interface StorageProvider {
  put(bucket: string, key: string, buffer: Buffer, contentType: string): Promise<StoredObject>;
  signedUrl(bucket: string, key: string, ttlSeconds: number): Promise<string>;
  delete(bucket: string, key: string): Promise<void>;
}
