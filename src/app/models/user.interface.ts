export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  fechaRegistro: number[];
  rol: 'ROL_ARTISTA' | 'ROL_OYENTE';
  idArtista?: number;
}
