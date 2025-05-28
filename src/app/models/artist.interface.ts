export interface Artist {
  id: number;
  nombreArtistico: string;
  biografia: string;
  imagenUrl: string;
}

export interface SearchResult {
  artists: Artist[];
  songs: ApiSong[];
}

export interface ApiSong {
  id: number;
  titulo: string;
  duracion: number;
  archivoUrl: string;
  artistaId: number;
  albumId: number | null;
}

export interface PlayCountData {
  fecha: [number, number, number]; // [year, month, day]
  conteo: number;
}
