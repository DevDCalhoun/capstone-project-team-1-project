document.addEventListener('DOMContentLoaded', function () {
  var searchForm = document.getElementById('searchForm');
  var toggleIcon = document.getElementById('toggleIcon');

  if (searchForm.classList.contains('show')) {
    toggleIcon.classList.remove('bi-chevron-down');
    toggleIcon.classList.add('bi-chevron-up');
  }

  searchForm.addEventListener('show.bs.collapse', function () {
    toggleIcon.classList.remove('bi-chevron-down');
    toggleIcon.classList.add('bi-chevron-up');
  });

  searchForm.addEventListener('hide.bs.collapse', function () {
    toggleIcon.classList.remove('bi-chevron-up');
    toggleIcon.classList.add('bi-chevron-down');
  });
});
