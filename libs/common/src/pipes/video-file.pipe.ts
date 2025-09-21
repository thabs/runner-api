import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class VideoFileValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = new Set([
    'video/mp4',
    'video/x-msvideo', // avi
    'video/x-matroska', // mkv
    'video/quicktime', // mov
    'video/webm',
  ]);

  private readonly maxSizeBytes = 50 * 1024 * 1024; // 50 MB

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    // ✅ Validate mimetype
    if (!this.allowedMimeTypes.has(file.mimetype)) {
      throw new BadRequestException(
        `Invalid video type. Allowed: ${Array.from(this.allowedMimeTypes).join(', ')}`
      );
    }

    // ✅ Validate size
    if (file.size > this.maxSizeBytes) {
      throw new BadRequestException(
        `File too large. Max size is ${this.maxSizeBytes / (1024 * 1024)} MB`
      );
    }

    return file;
  }
}
