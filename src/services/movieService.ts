// Выполните функцию fetchMoviesдля выполнения HTTP-запросов в отдельный файл 
// src/services/movieService.ts. Типизируйте ее параметры, возвращаемый
//  результат и ответ от Axios.

import axios from 'axios';
import type { Movie } from '../types/movie';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const token = import.meta.env.VITE_TMDB_TOKEN;

export interface FetchMoviesParams {
  query: string;
  page: number;
}

interface SearchMoviesResponse {
 results: Movie[];
 total_pages: number;
}

export async function fetchMovies({query, page}: FetchMoviesParams): Promise<SearchMoviesResponse> {
 const response = await axios.get<SearchMoviesResponse>(`${API_BASE_URL}/search/movie`, {
  params: { query, page },
  headers: {
   Authorization: `Bearer ${token}`,
  },
 });

 return response.data;
}
