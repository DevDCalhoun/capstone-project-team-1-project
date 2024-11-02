document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');

    // Set the minimum date as today in the user's local timezone
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${year}-${month}-${day}`;

    // Remove time restrictions on the front-end for flexibility
    dateInput.addEventListener('change', () => {
        timeInput.min = "00:00"; // Reset time min restriction
    });
});