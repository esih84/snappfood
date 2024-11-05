import { EntityNames } from 'src/common/enums/entity-name.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SupplierEntity } from './supplier.entity';

@Entity(EntityNames.SupplierDocuments)
export class SupplierDocumentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ nullable: true })
  image: string;
  @Column({ nullable: true })
  document: string;
  @Column()
  supplierId: number;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.documents, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;
}
