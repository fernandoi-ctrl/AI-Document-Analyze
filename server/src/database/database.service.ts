import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private supabase!: SupabaseClient;

  // constructor(private readonly config: ConfigService) { }
  constructor(private configService: ConfigService) { }

  onModuleInit(): void {
    // const url = this.config.get<string>('SUPABASE_URL');
    // const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      throw new InternalServerErrorException('Supabase credentials are not configured');
    }
    this.supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
