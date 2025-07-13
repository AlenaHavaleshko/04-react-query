import { useEffect } from "react";
import css from "./MovieModal.module.css";
import type { Movie } from "../../types/movie";
import { createPortal } from "react-dom";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}
// закриття по бекдропу
export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // закриття по escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";                  // заборона прокрутки фону

    return () => {
      document.removeEventListener("keydown", handleKeyDown); // очищення при закриті
      document.body.style.overflow = "";                      // повертаємо прокрутку
    };
  }, [onClose]);

  return createPortal(
    <>
      <div
        className={css.backdrop}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
      >
        <div className={css.modal}>
          <button
            className={css.closeButton}
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className={css.image}
          />
          <div className={css.content}>
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <p>
              <strong>{movie.release_date}</strong>
            </p>
            <p>
              <strong>Rating:</strong>
              {movie.vote_average}/10
            </p>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
