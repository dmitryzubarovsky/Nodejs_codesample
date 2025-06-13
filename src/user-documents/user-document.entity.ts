import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { UsersDocumentsStatus } from '../common/enums';
import { User } from '../users/user.entity';
import { File } from '../files/file.entity';

@Entity('users_documents')
export class UsersDocuments extends BaseEntity {
  @Column()
  status: UsersDocumentsStatus;

  @Column()
  comment: string;

  @ManyToOne(() => User, user => user.document)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @OneToOne(() => File, file => file.invoice)
  @JoinColumn({ name: 'file_id', })
  file: File;
}
