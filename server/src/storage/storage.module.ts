import { Global, Module } from '@nestjs/common';
import { STORAGE_PROVIDER } from './storage-provider.tokens';
import { SupabaseStorageProvider } from './providers/supabase-storage.provider';

@Global()
@Module({
  providers: [{ provide: STORAGE_PROVIDER, useClass: SupabaseStorageProvider }],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
