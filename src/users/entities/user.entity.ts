import { PrimaryGeneratedColumn,Column, Entity } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    age: number;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;
}
