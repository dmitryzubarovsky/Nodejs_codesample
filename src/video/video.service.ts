import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { VideoRepository } from './video.repository';
import type {
  UpdateVideoDTO,
  UpdateVideoResponseDTO
} from './DTO';
import { VimeoService } from '../common/services';
import type { Video } from './video.entity';
import { ImageService } from '../images/image.service';
import type { BaseMessageDTO } from '../common/base';
import { StorageContainerEnum } from '../common/enums';
import type { IVideoWithLinks } from './interfaces';
import { TrainingService } from '../trainings/training.service';
import { MediaService } from '../medias/media.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly vimeoService: VimeoService,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
    @Inject(forwardRef(() => TrainingService))
    private readonly trainingService: TrainingService,
    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService
  ) { }

  async update(id: number, body: UpdateVideoDTO): Promise<UpdateVideoResponseDTO> {
    await this.readVideoById(id);
    const previewImage = await this.imageService.readImageById(body.previewImageId, StorageContainerEnum.PREVIEW_IMAGES);
    return this.videoRepository.updateEntity(id, { previewImage, });
  }

  async delete(id: number): Promise<BaseMessageDTO> {
    const video = await this.readVideoById(id);
    await this.vimeoService.deleteVideo(video.thirdPartyVideoId);
    await this.videoRepository.softDeleteEntity(id);
    await this.trainingService.softDeleteByVideo(video);
    await this.mediaService.softDeleteByVideo(video);
    return { message: 'The entity was successfully deleted', };
  }

  async upload(filePath: string, name: string): Promise<Video> {
    const thirdPartyVideo = await this.vimeoService.uploadVideo(filePath, name);
    const thirdPartyVideoId = thirdPartyVideo.replace('/videos/', '');
    return this.videoRepository.createEntity({ thirdPartyVideoId, });
  }

  async readVideoByIdWithDirectLinks(id: number): Promise<IVideoWithLinks> {
    const video = await this.readVideoById(id);
    const vimeoVideos = await this.vimeoService.getVideo(video.thirdPartyVideoId);
    if (vimeoVideos.download) {
      return {
        ...video,
        link: vimeoVideos.link,
        files: vimeoVideos.download.map(item => ({
          fps: item.fps,
          width: item.width,
          height: item.height,
          size: item.size,
          type: item.type,
          link: item.link,
        })),
      };
    }
    return {
      ...video,
      link: vimeoVideos.link,
      files: [ {
        fps: vimeoVideos.fps as number,
        width: vimeoVideos.width as number,
        height: vimeoVideos.height as number,
        size: vimeoVideos.size as number,
        type: vimeoVideos.type as string,
        link: vimeoVideos.link,
      }, ],
    };
  }

  async readVideoById(id: number, relations?: Array<string>): Promise<Video> {
    const video = await this.videoRepository.readEntityById(id, { relations, });
    if (!video) {
      throw new NotFoundException('The entity with this id was not found');
    }
    return video;
  }
}
