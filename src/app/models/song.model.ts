export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  imageUrl: string;
  isExplicit?: boolean;
  archivoUrl?: string;
  isVideo?: boolean;
  color?: string;
}

export interface RecentSearch {
  id: string;
  name: string;
  type: 'artist' | 'song';
  imageUrl: string;
} 