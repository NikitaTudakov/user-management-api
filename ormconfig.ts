
import { DataSourceOptions } from 'typeorm';

// export const connectionOptions = {
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'postgres',
//     password: 'xyz1234',
//     database: 'usermanagement',
//     entities: ['dist/**/*.entity{.ts,.js}'],
//     synchronize: true,
// } as DataSourceOptions;

export const connectionOptions = {
    type: 'postgres',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    name: "default",
    url: 'postgres://kthhkpam:H-OIGH4L2ZMHge8A6yt57TNZzdlAYrJs@trumpet.db.elephantsql.com/kthhkpam', 
    logging: true,
} as DataSourceOptions;