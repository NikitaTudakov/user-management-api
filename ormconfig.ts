
import { DataSourceOptions } from 'typeorm';

export const connectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'xyz1234',
    database: 'usermanagement',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
} as DataSourceOptions;