import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtTokenConfig = {
    global: true,
    secret: "TSeNqBhSXytDd5xuMbE3DIshDKjKZj3C",
    signOptions: { expiresIn: '60s' },
} as JwtModuleOptions;