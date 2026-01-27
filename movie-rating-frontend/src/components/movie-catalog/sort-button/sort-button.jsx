import "./sort-button.css";

export default function SortButton({ sortOrder, handleSortOrderButton }) {
    return (
        <button
            className={`sort-button ${sortOrder === "asc" ? "sort-button--asc" : "sort-button--desc"}`}
            onClick={handleSortOrderButton}
            aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
        >
            <span className="sort-button__icon"></span>
        </button>
    );
}
