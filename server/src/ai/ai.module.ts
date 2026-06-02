import { Global, Module } from '@nestjs/common';
import { AI_PROVIDER } from './ai-provider.tokens';
import { ClaudeAIProvider } from './providers/claude-ai.provider';

@Global()
@Module({
  providers: [{ provide: AI_PROVIDER, useClass: ClaudeAIProvider }],
  exports: [AI_PROVIDER],
})
export class AiModule {}
