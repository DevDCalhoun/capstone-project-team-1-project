document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = document.getElementById('profilePicture').files[0];
    if (!file) return alert('Please select a file');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result.split(',')[1];
      const csrfToken = document.querySelector('input[name="_csrf"]').value;

      try {
        const response = await fetch('/user/profile/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify({ image: base64String }),
        });

        const result = await response.json();
        if (result.success) {
          location.reload();
        } else {
          alert(result.error || 'Error uploading profile picture');
          console.error(result.error);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
      }
    };
    reader.readAsDataURL(file);
  });
});