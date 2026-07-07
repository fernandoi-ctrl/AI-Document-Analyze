// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import * as jwksRsa from 'jwks-rsa';

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       // Extrae el token del header Authorization: Bearer <token>
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       // No uses tu JWT_SECRET, usa JWKS de Supabase
//       secretOrKeyProvider: jwksRsa.passportJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: 'https://tjkxahablborautfvotf.supabase.co/auth/v1/jwks',
//       }),
//       algorithms: ['RS256'], // Supabase usa RS256
//     });
//   }

//   async validate(payload: any) {
//     // Aquí puedes mapear el payload a tu usuario
//     return {
//       id: payload.sub,
//       email: payload.email,
//       role: payload.role,
//     };
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import * as jwksRsa from 'jwks-rsa';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
//     if (!supabaseKey) {
//       throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
//     }
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKeyProvider: jwksRsa.passportJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: 'https://tjkxahablborautfvotf.supabase.co/auth/v1/jwks',
//         requestHeaders: {
//           apikey: supabaseKey, // 👈 necesario
//         },
//       }),
//       algorithms: ['RS256'], // Supabase firma con RS256
//     });
//   }

//   async validate(payload: any) {
//     return {
//       id: payload.sub,
//       email: payload.email,
//       role: payload.role,
//     };
//   }
// }


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    console.log('JWT_SECRET cargado en JwtStrategy:', secret);
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // 👈 ahora siempre es string
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    console.log('Payload recibido en JwtStrategy:', payload);
    return { id: payload.sub, email: payload.email };
  }
}
