export default function validateDate(date) {
    const dateObj = new Date(date);

    const day = String(dateObj.getDate()).padStart(2, "0"); // Ensure 2 digits
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = dateObj.getFullYear();

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}
