import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { GeoLocationService } from '../geo-location.interface';
import { DEFAULT_JURISDICTION, Jurisdiction } from '../jurisdiction.types';

/**
 * Country-code headers commonly injected by CDNs / edge proxies, in priority
 * order. Values are ISO 3166-1 alpha-2 codes (e.g. 'MX').
 */
const GEO_HEADERS = [
  'cf-ipcountry', // Cloudflare
  'x-vercel-ip-country', // Vercel
  'x-appengine-country', // Google App Engine
  'x-country-code',
  'x-country',
] as const;

/** Placeholder values some proxies emit when the country is unknown. */
const UNKNOWN_CODES = new Set(['', 'XX', 'ZZ', 'T1']);

/**
 * Resolves the caller's country primarily from trusted CDN/proxy geo headers,
 * falling back to an offline IP lookup (geoip-lite) when available. If nothing
 * resolves, callers get {@link DEFAULT_JURISDICTION}.
 */
@Injectable()
export class RequestGeoProvider implements GeoLocationService {
  private readonly logger = new Logger(RequestGeoProvider.name);
  private readonly regionNames = new Intl.DisplayNames(['es'], { type: 'region' });

  resolveFromRequest(req: Request): Jurisdiction {
    const code = this.codeFromHeaders(req) ?? this.codeFromIp(req);
    if (!code) {
      this.logger.warn('No se pudo detectar el país; usando jurisdicción por defecto (MX).');
      return DEFAULT_JURISDICTION;
    }
    return this.toJurisdiction(code);
  }

  private codeFromHeaders(req: Request): string | null {
    for (const header of GEO_HEADERS) {
      const raw = req.headers[header];
      const value = Array.isArray(raw) ? raw[0] : raw;
      const code = value?.trim().toUpperCase();
      if (code && !UNKNOWN_CODES.has(code)) return code;
    }
    return null;
  }

  private codeFromIp(req: Request): string | null {
    const ip = this.clientIp(req);
    if (!ip) return null;
    try {
      // Optional dependency: absent installs simply fall back to the default.
      const geoip = require('geoip-lite') as {
        lookup(ip: string): { country?: string } | null;
      };
      const country = geoip.lookup(ip)?.country?.toUpperCase();
      return country && !UNKNOWN_CODES.has(country) ? country : null;
    } catch {
      return null;
    }
  }

  private clientIp(req: Request): string | null {
    const forwarded = req.headers['x-forwarded-for'];
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
    const ip = (first ?? req.ip ?? req.socket?.remoteAddress ?? '').trim();
    // Strip IPv6-mapped IPv4 prefix and drop loopback (no useful geo).
    const normalized = ip.replace(/^::ffff:/, '');
    if (!normalized || normalized === '::1' || normalized.startsWith('127.')) return null;
    return normalized;
  }

  private toJurisdiction(countryCode: string): Jurisdiction {
    let countryName = countryCode;
    try {
      countryName = this.regionNames.of(countryCode) ?? countryCode;
    } catch {
      // Non-standard code: keep the raw code as the name.
    }
    return { countryCode, countryName };
  }
}
