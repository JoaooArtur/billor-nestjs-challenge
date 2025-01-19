import { Roles } from 'src/modules/auth/domain/enumerations/roles.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserAggregate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  static create(name: string, email: string, password: string, role: Roles): UserAggregate {
    const user = new UserAggregate();
    user.name = name;
    user.password = password;
    user.role = role;
    user.email = email;
    user.createdAt = new Date();
    return user;
  }
}
