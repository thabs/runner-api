import { Media, MediaCategory } from '@app/models';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediasService {
  private readonly s3: S3;
  private readonly bucket: string;

  constructor(
    @InjectRepository(Media) private mediasRepository: Repository<Media>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.s3 = new S3({
      region: this.configService.get('AWS_S3_BUCKET_REGION'),
      accessKeyId: this.configService.get('AWS_S3_BUCKET_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_S3_BUCKET_SECRET_ACCESS_KEY'),
    });
    this.bucket = this.configService.get('AWS_S3_BUCKET_NAME') ?? '';
  }

  async create(mediaCategory: MediaCategory, file: Express.Multer.File): Promise<Media> {
    try {
      const extension = file.filename.split('.').pop();
      const key = `${mediaCategory}/${uuidv4()}.${extension}`;

      let params = {
        Bucket: this.bucket,
        ContentType: file.mimetype,
        Key: key,
      };

      const url = await this.s3.getSignedUrlPromise('getObject', params);
      await this.httpService.put(url, file, {
        headers: {
          'Content-Type': file.mimetype,
        },
      });

      const media = this.mediasRepository.create({
        mimeType: file.mimetype,
        category: mediaCategory,
        url,
      });
      return this.mediasRepository.save(media);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Media | null> {
    const media = await this.mediasRepository.findOneBy({ id });
    return media;
  }

  async update(id: string, file: Express.Multer.File): Promise<Media> {
    try {
      const media = await this.mediasRepository.findOneBy({ id });
      if (!media) throw new BadRequestException('Media not found');

      const { url, category } = media;

      //! Delete from AWS
      await this.s3
        .deleteObject({
          Bucket: this.bucket,
          Key: url,
        })
        .promise();

      const extension = file.filename.split('.').pop();
      const key = `${category}/${uuidv4()}.${extension}`;

      const params = {
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        ContentType: file.mimetype,
        Key: key,
      };

      const newMediaUrl = await this.s3.getSignedUrlPromise('getObject', params);
      await this.httpService.put(newMediaUrl, file, {
        headers: {
          'Content-Type': file.mimetype,
        },
      });

      Object.assign(media, {
        mimeType: file.mimetype,
        url: newMediaUrl,
      });

      return this.mediasRepository.save(media);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const media = await this.mediasRepository.findOneBy({ id });
    if (!media) throw new BadRequestException('Media not found');

    await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: media.url,
      })
      .promise();

    return this.mediasRepository.remove(media);
  }
}
