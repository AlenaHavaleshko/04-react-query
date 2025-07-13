import { useState } from "react";
import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", searchValue, page],
    queryFn: () => fetchMovies({ query: searchValue, page }),
    enabled: searchValue.length > 0, //  Запит активується тільки після введення пошукового запитуесть запрос
    placeholderData: keepPreviousData,
  });

  const handleSubmit = (newSearchValue: string) => {
    setSearchValue(newSearchValue); // передаётся в useQuery
    setPage(1); // сбрасываем пагинацию на первую страницу
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setPage(selected + 1); // Змінюємо сторінку на вибрану в реакт пагинейт
  };

  const handleSelect = (movie: Movie) => {
    if (!movie) return; // захист від некоректних даних
    setSelectedMovie(movie); // Встановлюємо вибраний фільм
  };

  const closeModal = () => {
    setSelectedMovie(null); // Закриваємо модальне вікно
  };

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSubmit} />

      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage
          message={error instanceof Error ? error.message : "Unknown error"}
        />
      )}

      {data?.results?.length === 0 && (
        <p>No movies found. Try a different search query.</p>
      )}

      {/* Рендеримо список фільмів, якщо є дані */}
      {data?.results && (
        <MovieGrid movies={data.results} onSelect={handleSelect} />
      )}

      {/* Пагінація */}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageClick}
          forcePage={page - 1}
          renderOnZeroPageCount={null}  // не рендерити ,якщо pageCount = 0
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
          breakLabel="..."
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
