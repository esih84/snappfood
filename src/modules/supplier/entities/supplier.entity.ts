import { EntityNames } from 'src/common/enums/entity-name.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupplierOtpEntity } from './otp.entity';
import { SupplierStatus } from '../enums/supplier-status.enum';
import { SupplierDocumentEntity } from './supplier-document.entity';

@Entity(EntityNames.Supplier)
export class SupplierEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  phone: string;
  @Column()
  manager_name: string;
  @Column()
  manager_family: string;
  @Column()
  store_name: string;
  @Column({ nullable: true })
  CategoryId: number;
  @ManyToOne(() => CategoryEntity, (category) => category.suppliers, {
    onDelete: 'SET NULL',
  })
  category: CategoryEntity;
  @Column()
  city: string;
  @Column({ nullable: true })
  national_code: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true, default: SupplierStatus.Registered })
  status: string;
  @Column()
  invite_code: string;
  @Column({ nullable: true })
  agentId: number;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.subsets, {
    onDelete: 'SET NULL',
  })
  agent: SupplierEntity;
  @OneToMany(() => SupplierEntity, (supplier) => supplier.agent)
  subsets: SupplierEntity[];
  @Column({ nullable: true })
  otpId: number;
  @OneToOne(() => SupplierOtpEntity, (otp) => otp.supplier)
  @JoinColumn()
  otp: SupplierOtpEntity;
  @Column({ nullable: true, default: false })
  mobile_verified: boolean;
  @OneToMany(() => SupplierDocumentEntity, (document) => document.supplier)
  documents: SupplierDocumentEntity[];
}
