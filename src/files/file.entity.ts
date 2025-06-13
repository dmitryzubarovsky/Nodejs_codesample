import { Column, Entity, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { Image } from '../images/image.entity';
import { Invoice } from '../invoices/invoice.entity';

@Entity('files')
export class File extends BaseEntity {
  @Column({ name: 'container_name', })
  containerName: string;

  @Column({ name: 'file_name', })
  fileName: string;

  @Column({ name: 'file_size', })
  fileSize: number;

  @Column({ name: 'content_type', })
  contentType: string;

  @OneToOne(() => Image, image => image.file)
  image: Image;

  @OneToOne(() => Invoice, invoice => invoice.file)
  invoice: Invoice;
}
