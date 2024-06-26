fetch('http://localhost:3100/chart-data')
  .then(response => response.json())
  .then(data => {
    // Convert time from seconds to hours
    data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(seconds => seconds / 3600); // Convert seconds to hours
    });

    // Customize colors
    const colors = {
      backgroundColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082'], // Red, Black, Teal, Gold, Indigo
      borderColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082']
    };

    // Apply colors to each dataset
    data.datasets.forEach((dataset, index) => {
      const colorIndex = index % colors.backgroundColor.length;
      dataset.backgroundColor = colors.backgroundColor[colorIndex];
      dataset.borderColor = colors.borderColor[colorIndex];
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                size: 16 // Increase font size for x-axis labels
              }
            },
            title: {
              display: true,
              text: 'Usernames:',
              font: {
                size: 20 // Font size for the x-axis label
              }
            }
          },
          y: {
            stacked: true,
            ticks: {
              font: {
                size: 16 // Increase font size for y-axis labels
              },
              callback: function(value) {
                return value.toFixed(1) + 'h'; // Display hours with one decimal place and 'h' suffix
              }
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Issue Time Allocation By User', // Add your chart title here
            font: {
              size: 24 // Font size for the title
            }
          },
          legend: {
            display: true,
            labels: {
              font: {
                size: 16 // Increase font size for legend labels
              }
            },
            title: {
              display: true,
              text: 'Github Issue:',
              font: {
                size: 18 // Font size for the legend title
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error:', error));
