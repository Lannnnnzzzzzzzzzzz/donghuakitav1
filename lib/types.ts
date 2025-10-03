export interface DonghuaCard {
  title: string
  slug: string
  poster: string
  episode?: string
  rating?: string
  status?: string
  type?: string
}

export type DonghuaCardType = DonghuaCard

export interface DonghuaDetail {
  status: string
  creator: string
  title: string
  alter_title?: string
  poster: string
  rating?: string
  studio?: string
  network?: string
  released?: string
  duration?: string
  type: string
  episodes_count?: string
  season?: string
  country?: string
  released_on?: string
  updated_on?: string
  genres: Genre[]
  synopsis: string
  episodes_list: EpisodeListItem[]
}

export interface Genre {
  name: string
  slug: string
  url?: string
}

export interface EpisodeListItem {
  episode: string
  slug: string
  url?: string
}

export interface Episode {
  title: string
  slug: string
  episode: string
  releaseDate?: string
}

export interface EpisodeDetail {
  status: string
  creator: string
  episode: string
  streaming: {
    main_url: StreamingServer
    servers: StreamingServer[]
  }
  download_url: {
    download_url_360p?: DownloadProviders
    download_url_480p?: DownloadProviders
    download_url_720p?: DownloadProviders
    download_url_1080p?: DownloadProviders
    download_url_4k?: DownloadProviders
  }
  donghua_details: {
    title: string
    slug: string
    url: string
    poster: string
    type: string
    released: string
    uploader: string
  }
  navigation: {
    all_episodes: {
      slug: string
      url: string
    }
    previous_episode?: {
      episode: string
      slug: string
      url: string
    }
    next_episode?: {
      episode: string
      slug: string
      url: string
    }
  }
}

export interface StreamingServer {
  name: string
  url: string
}

export interface DownloadProviders {
  [provider: string]: string
}

export interface DownloadLink {
  quality: string
  url: string
  size?: string
}
