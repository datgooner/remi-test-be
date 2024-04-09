export interface YoutubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: any[];
}

export interface YoutubeVideoDetail {
  id: string;
  snippet: YoutubeVideoSnippet;
  // TODO: i don't care about statistics for now
  statistics?: object;
}
export interface YoutubeVideoDetailResponse {
  items: YoutubeVideoDetail[];
}
