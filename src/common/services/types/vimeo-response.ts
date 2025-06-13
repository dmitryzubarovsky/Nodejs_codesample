type Download = {
  created_time: string;
  expires: string;
  fps: number;
  width: number;
  height: number;
  link: string;
  md5: string;
  public_name: string;
  quolity: string;
  rendition: string;
  size: number;
  size_short: string;
  type: string;
};

export type VimeoResponse = {
  download: Array<Download>
  link: string;
} & Record<string, unknown>;
