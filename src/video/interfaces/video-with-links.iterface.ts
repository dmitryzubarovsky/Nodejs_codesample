export interface IFile {
  fps: number;
  width: number;
  height: number;
  size: number;
  type: string;
  link: string;
}

export interface IVideoWithLinks {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  thirdPartyVideoId: string;
  link: string;
  previewImageId: number;
  files: Array<IFile>;
}
