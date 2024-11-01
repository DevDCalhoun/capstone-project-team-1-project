document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    dateInput.addEventListener('change', () => {
        const selectedDate = new Date(dateInput.value);
        const currentDate = new Date();


        // If today is selected, set the min time to the current time
        if (selectedDate.toDateString() === currentDate.toDateString()) {
            let currentTime = currentDate.toTimeString().split(':');
            timeInput.min = `${currentTime[0]}:${currentTime[1]}`;
        } else {
            timeInput.min = "00:00";
        }
    });
});
