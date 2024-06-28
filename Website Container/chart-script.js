fetch('http://localhost:3100/chart-data')
  .then(response => response.json())
  .then(data => {
    const barChartData = data.barChartData;

    // Customize colors
    const colors = {
      backgroundColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082', '#00FF00', '#0000FF', '#800080', '#FFA500', '#808080'], // Colors for top 10 users
      borderColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082', '#00FF00', '#0000FF', '#800080', '#FFA500', '#808080']
    };

    // Apply colors to each dataset
    barChartData.datasets.forEach((dataset, index) => {
      dataset.backgroundColor = colors.backgroundColor[index % colors.backgroundColor.length];
      dataset.borderColor = colors.borderColor[index % colors.borderColor.length];
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: barChartData,
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
                return value + ' hrs'; // Append 'hrs' to each value
              }
            },
            title: {
              display: true,
              text: 'Time (hours)',
              font: {
                size: 20 // Font size for the y-axis label
              }
            },
            beginAtZero: true // Start the y-axis at zero
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Top Ten Users by Time Spent', // Chart title
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
              text: 'Github Issue:', // Legend title
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
