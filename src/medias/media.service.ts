import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { vimeoUrl } from 'src/common/constants';
import { VideoService } from '../video/video.service';
import type { BaseMessageDTO } from '../common/base';
import { MediaRepository } from './media.repository';
import type {
  CreateMediaDTO,
  MediaResponseDTO,
  ReadAllMediasResponseDTO,
  ReadMediaAdminDTO,
  ReadMediaDTO,
  UpdateMediaDTO
} from './DTO';
import { Media } from './media.entity';
import type { Video } from '../video/video.entity';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService
  ) { }

  async create(body: CreateMediaDTO): Promise<MediaResponseDTO> {
    const { videoId, ...media } = body;
    const video = await this.videoService.readVideoById(videoId);
    const recordIsExist = !!await this.mediaRepository.readEntity({ where: { video, }, });
    if (recordIsExist) {
      throw new BadRequestException('Media with this video id already exist ');
    }
    return this.mediaRepository.createEntity({ video, ...media, });
  }

  async readForUser(id: number): Promise<ReadMediaDTO> {
    const { video, ...media } = await this.readMediaById(id, [ 'video', ]);
    const videoWithFiles = await this.videoService.readVideoByIdWithDirectLinks(video.id);
    return {
      ...media,
      previewImageId: videoWithFiles.previewImageId,
      link: videoWithFiles.link,
      files: videoWithFiles.files,
    };
  }

  async readForAdmin(id: number): Promise<ReadMediaAdminDTO> {
    const { video, ...media } = await this.readMediaById(id, [ 'video', ]);
    return {
      ...media,
      link: vimeoUrl + video.thirdPartyVideoId,
      videoId: video.id,
      previewImageId: video.previewImageId,
    };
  }

  async readAllForUser(take?: number): Promise<Array<ReadAllMediasResponseDTO>> {
    const medias = await this.readAll(take);
    return medias.map(({ video, ...media }) => ({
      ...media,
      previewImageId: video.previewImageId,
      description: undefined,
    }));
  }

  async readAllForAdmin(): Promise<Array<ReadAllMediasResponseDTO>> {
    const medias = await this.readAll();
    return medias.map(({ video, ...media }) => ({
      ...media,
      previewImageId: video.previewImageId,
      description: undefined,
    }));
  }

  async update(id: number, body: UpdateMediaDTO): Promise<MediaResponseDTO> {
    await this.readMediaById(id);
    return this.mediaRepository.updateEntity(id, body);
  }

  async delete(id: number): Promise<BaseMessageDTO> {
    const media = await this.readMediaById(id, [ 'video', ]);
    await this.videoService.delete(media.video.id);
    await this.mediaRepository.softDeleteEntity(id);
    return { message: 'The entity was successfully deleted', };
  }

  async readMediaById(id: number, relations?: Array<string>): Promise<Media> {
    const training = await this.mediaRepository.readEntityById(id, { relations, });
    if (!training) {
      throw new NotFoundException('The media with this id was not found');
    }
    return training;
  }
  async softDeleteByVideo(video: Video): Promise<BaseMessageDTO> {
    const media = await this.mediaRepository.readEntity({ where: { video, }, });
    if (media) {
      await this.mediaRepository.softDeleteEntity(media.id);
    }
    return { message: 'The entity was successfully deleted', };
  }

  private readAll(take?: number): Promise<Array<Media>> {
    const condition: FindManyOptions = {
      relations: [ 'video', ],
      order: {
        updatedAt: 'DESC',
      },
    };
    if (take) {
      condition.take = take;
    }
    return this.mediaRepository.readAllEntities(condition);
  }
}
