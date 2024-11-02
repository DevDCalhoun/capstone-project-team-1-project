document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');

    // Set the minimum date as the user's local date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${year}-${month}-${day}`;

    dateInput.addEventListener('change', () => {
        const selectedDate = new Date(dateInput.value);
        const currentDate = new Date();

        // If the user selects today, set the minimum time to the current local time
        if (selectedDate.toDateString() === currentDate.toDateString()) {
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            timeInput.min = `${hours}:${minutes}`;
        } else {
            // Reset min time for other dates
            timeInput.min = "00:00";
        }
    });
});