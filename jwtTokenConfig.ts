import { JwtModuleOptions } from "@nestjs/jwt";
import { SECRET_KEY } from "./constants";

export const jwtTokenConfig = {
    global: true,
    secret: SECRET_KEY,
    signOptions: { expiresIn: '24h' },
} as JwtModuleOptions;