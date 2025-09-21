import { Media } from '@app/models';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaFileDto } from './dto/update-media-file.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

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

  async create(file: Express.Multer.File, createMediaDto: CreateMediaDto) {
    const { mimeType, category } = createMediaDto;

    try {
      const mediaCategory = category.toLowerCase().replace(/[^a-z]/g, '');
      const extension = file.filename.split('.').pop();
      const key = `${mediaCategory}/${uuidv4()}.${extension}`;

      let params = {
        Bucket: this.bucket,
        ContentType: mimeType,
        Key: key,
      };

      const url = await this.s3.getSignedUrlPromise('getObject', params);
      await this.httpService.put(url, file, {
        headers: {
          'Content-Type': mimeType,
        },
      });

      const media = this.mediasRepository.create({
        ...createMediaDto,
        url,
      });
      return this.mediasRepository.save(media);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    const media = await this.mediasRepository.findOneBy({ id });
    return media;
  }

  async update(id: string, updateMediaDto: UpdateMediaDto) {
    const media = await this.mediasRepository.findOneBy({ id });
    if (!media) throw new BadRequestException('media not found');

    Object.assign(media, updateMediaDto);
    return this.mediasRepository.save(media);
  }

  async updateFile(file: Express.Multer.File, id: string, updateMediaFileDto: UpdateMediaFileDto) {
    try {
      const { url, mimeType } = updateMediaFileDto;

      const media = await this.mediasRepository.findOneBy({ id });
      if (!media) throw new BadRequestException('media not found');

      //! Delete from AWS
      await this.s3
        .deleteObject({
          Bucket: this.bucket,
          Key: url,
        })
        .promise();

      const mediaCategory = media.category.toLowerCase().replace(/[^a-z]/g, '');
      const extension = file.filename.split('.').pop();
      const key = `${mediaCategory}/${uuidv4()}.${extension}`;

      const params = {
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        ContentType: mimeType,
        Key: key,
      };

      const newMediaUrl = await this.s3.getSignedUrlPromise('getObject', params);
      await this.httpService.put(newMediaUrl, file, {
        headers: {
          'Content-Type': mimeType,
        },
      });

      Object.assign(media, {
        ...updateMediaFileDto,
        url: newMediaUrl,
      });
      return this.mediasRepository.save(media);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const media = await this.mediasRepository.findOneBy({ id });
    if (!media) throw new BadRequestException('media not found');

    await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: media.url,
      })
      .promise();

    return this.mediasRepository.remove(media);
  }
}
