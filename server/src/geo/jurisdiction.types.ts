/**
 * A resolved legal jurisdiction. `countryCode` is an ISO 3166-1 alpha-2 code
 * (e.g. 'MX'); `countryName` is the human-readable name in Spanish (e.g. 'México')
 * used to steer the AI toward that country's legal system.
 */
export interface Jurisdiction {
  countryCode: string;
  countryName: string;
}

/**
 * Fallback jurisdiction when the country cannot be detected from the request.
 * Mexico is the platform's primary market, so it is the safest default.
 */
export const DEFAULT_JURISDICTION: Jurisdiction = {
  countryCode: 'MX',
  countryName: 'México',
};
