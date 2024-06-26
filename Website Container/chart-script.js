fetch('http://localhost:3100/chart-data')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    });
  })
  .catch(error => console.error('Error:', error));