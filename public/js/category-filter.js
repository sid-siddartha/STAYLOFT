<script>
  const filters = document.querySelectorAll('.filter');
  const listings = document.querySelectorAll('.col');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Remove 'active' from all
      filters.forEach(f => f.classList.remove('active'));
      // Add 'active' to clicked one
      filter.classList.add('active');

      const selectedCategory = filter.dataset.category;

      listings.forEach(listing => {
        if (selectedCategory === "Trending") {
          listing.style.display = "block"; // Show all for Trending
        } else {
          if (listing.dataset.category === selectedCategory) {
            listing.style.display = "block";
          } else {
            listing.style.display = "none";
          }
        }
      });
    });
  });
</script>
