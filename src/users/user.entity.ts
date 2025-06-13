import { Column, Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from '../common/base';
import { Image } from '../images/image.entity';
import { GroupUsers } from '../group-users/group-users.entity';
import { Lead } from '../leads/lead.entity';
import { Complaint } from '../complaints/complaint.entity';
import { Sale } from '../sales/sale.entity';
import { MailToken } from '../mail-tokens/mail-token.entity';
import { Invoice } from '../invoices/invoice.entity';
import { UsersDocuments } from '../user-documents/user-document.entity';
import { BankAccount } from '../bank-accounts/bank-account.entity';
import { Pix } from '../PIX/pix.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'confirmed_at', })
  confirmedAt: Date;

  @Column({ name: 'full_name', })
  fullName: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column({ select: false, })
  password: string;

  @Column({ name: 'phone_number', })
  phoneNumber: string;

  @Column({ name: 'cpf', })
  cpf: string;

  @Column()
  profession: string;

  @Column({ name: 'birth_date', })
  birthDate: Date;

  @Column()
  about: string;

  @Column()
  zip: string;

  @Column({ name: 'country_id', })
  countryId: number;

  @Column({ name: 'state_id', })
  stateId: number;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  street: string;

  @Column()
  house: string;

  @Column()
  apartment: string;

  @Column({ name: 'refer_id', })
  referId: number;

  @Column({ name: 'stripe_account_id', select: false, })
  stripeAccountId: string;

  @Column({ name: 'uniq_key', select: false, })
  uniqKey: string;

  @Column({ name: 'locked_at', })
  lockedAt: Date;

  @Column({ name: 'avatar_image_id', })
  avatarImageId: number;

  @OneToMany(() => GroupUsers, groupUser => groupUser.user)
  groupUsers: Array<GroupUsers>;

  @OneToOne(() => Image, avatar => avatar.user)
  @JoinColumn({ name: 'avatar_image_id', })
  avatar: Image;

  @OneToOne(() => User, user => user.refer)
  @JoinColumn({ name: 'refer_id', })
  refer: User;

  @OneToMany(() => Lead, lead => lead.user)
  leads: Lead;

  @OneToMany(() => Sale, sale => sale.user)
  sales: Array<Sale>;

  @OneToMany(() => Complaint, complaint => complaint.user, { eager: true, })
  complaints: Array<Complaint>;

  @OneToMany(() => MailToken, mailToken => mailToken.user)
  mailToken: Array<MailToken>;

  @OneToMany(() => Invoice, invoice => invoice.user)
  invoice: Array<Invoice>;

  @OneToOne(() => UsersDocuments, document => document.user)
  @JoinColumn({ name: 'document_id', })
  document: UsersDocuments;

  @OneToMany(() => BankAccount, bankAccount => bankAccount.user, { eager: true, })
  bankAccount: Array<BankAccount>;

  @OneToOne(() => Pix, pix => pix.user)
  pix: Pix;
}
