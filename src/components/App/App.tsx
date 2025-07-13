import { useState } from "react";
import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
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
    enabled: searchValue.length > 0, 
    placeholderData: keepPreviousData,
  });

  const handleSubmit = (newSearchValue: string) => {
    setSearchValue(newSearchValue); 
    setPage(1); 
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setPage(selected + 1); 
  };

  const handleSelect = (movie: Movie) => {
    if (!movie) return; 
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null); 
  };

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
  if (isSuccess && data?.results?.length === 0) {
    toast.error("No movies found for your request.");
  }
}, [isSuccess, data]);

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
          renderOnZeroPageCount={null}  
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
