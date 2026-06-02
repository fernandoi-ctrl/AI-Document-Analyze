import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { StorageProvider, StoredObject } from '../storage-provider.interface';

@Injectable()
export class SupabaseStorageProvider implements StorageProvider {
  constructor(private readonly db: DatabaseService) {}

  async put(bucket: string, key: string, buffer: Buffer, contentType: string): Promise<StoredObject> {
    const { error } = await this.db.client.storage
      .from(bucket)
      .upload(key, buffer, { contentType, upsert: true });
    if (error) throw new InternalServerErrorException(error.message);
    return { key, contentType, size: buffer.byteLength };
  }

  async signedUrl(bucket: string, key: string, ttlSeconds: number): Promise<string> {
    const { data, error } = await this.db.client.storage
      .from(bucket)
      .createSignedUrl(key, ttlSeconds);
    if (error || !data) throw new InternalServerErrorException(error?.message ?? 'Signed URL failed');
    return data.signedUrl;
  }

  async delete(bucket: string, key: string): Promise<void> {
    const { error } = await this.db.client.storage.from(bucket).remove([key]);
    if (error) throw new InternalServerErrorException(error.message);
  }
}
