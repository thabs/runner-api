import { Media } from '@app/models';
import { Injectable } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { MediasService } from '../medias.service';

@Injectable()
@EventSubscriber()
export class MediaSubscriber implements EntitySubscriberInterface<Media> {
  constructor(private readonly mediasService: MediasService) {}

  listenTo() {
    return Media;
  }

  async beforeRemove(event: RemoveEvent<Media>) {
    const media = event.entity;
    if (media?.url) {
      await this.mediasService.deleteFile(media.url);
    }
  }
}
