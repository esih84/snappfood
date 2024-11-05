import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNames } from 'src/common/enums/entity-name.enum';
import { SupplierEntity } from './supplier.entity';

@Entity(EntityNames.SupplierOtp)
export class SupplierOtpEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  supplierId: Number;
  @OneToOne(() => SupplierEntity, (supplier) => supplier.otp, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;
}
