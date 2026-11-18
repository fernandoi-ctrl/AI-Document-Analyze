import { Request } from 'express';
import { Jurisdiction } from './jurisdiction.types';

/**
 * Abstraction over country detection. Implementations resolve the caller's
 * jurisdiction from the incoming HTTP request (CDN/proxy geo headers, IP
 * lookup, etc.) and never couple callers to a specific geo provider.
 */
export interface GeoLocationService {
  resolveFromRequest(req: Request): Jurisdiction;
}
