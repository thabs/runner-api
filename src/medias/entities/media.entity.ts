import { Plug } from 'src/plugs/entities/plug.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MimeType } from './mime-type.enum';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: MimeType,
  })
  mimeType: MimeType;

  @Column({ unique: true })
  url: string;

  @ManyToOne(() => Plug, (plug) => plug.medias)
  plug: Plug;
}
