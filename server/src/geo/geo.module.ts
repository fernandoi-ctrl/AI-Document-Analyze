import { Global, Module } from '@nestjs/common';
import { GEO_LOCATION } from './geo.tokens';
import { RequestGeoProvider } from './providers/request-geo.provider';

@Global()
@Module({
  providers: [{ provide: GEO_LOCATION, useClass: RequestGeoProvider }],
  exports: [GEO_LOCATION],
})
export class GeoModule {}
