import './sort-button.css';

export default function SortButton({ sortOrder, handleSortOrderButton }) {
    return (
        <button className={`sort-order-button sort-order-${sortOrder}`} onClick={handleSortOrderButton}>
            <span className="sort-order-icon"></span>
        </button>
    );
}