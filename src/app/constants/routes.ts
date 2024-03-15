export const ROUTING_PATHS = {
  RESUME_GAME: 'reanudar-juego',
  GAME_CONFIG: 'configuracion',
  CHANGE_CONFIG: 'editar-configuracion',
  RANKING: 'ranking',
  SCOREBOARD: 'tabla',
  STATISTICS: 'estadisticas',
  BRISCA: 'brisca',
  ENTER_SCORE: 'apuntar',
  ENTER_SCORE_POCHA: 'apuntar-pocha',
  ENTER_SCORE_BRISCA: 'apuntar-brisca',
} as const;

export type RoutingPath = (typeof ROUTING_PATHS)[keyof typeof ROUTING_PATHS];
