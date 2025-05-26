export interface Playlist {
  id: number;
  nombre: string;
  usuarioId: number;
  visibilidad: 'PUBLICA' | 'PRIVADA';
  fechaCreacion: number[];
}
