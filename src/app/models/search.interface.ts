export interface Artist {
  id: number;
  nombreArtistico: string;
  biografia: string;
  imagenUrl: string;
}

export interface Song {
  id: number;
  titulo: string;
  duracion: number;
  archivoUrl: string;
  artistaId: number;
  albumId: number | null;
}
