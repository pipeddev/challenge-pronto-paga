import { httpRequest } from '../../../shared/api/http-client.ts';

export interface ScoreResponse {
  rut: string;
  score: number;
  fecha: string;
}

export const scoreApi = {
  getByRut: (rut: string, token: string) =>
    httpRequest<ScoreResponse>(`/score/${encodeURIComponent(rut)}`, { method: 'GET' }, token),
};
