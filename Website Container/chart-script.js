fetch('http://localhost:3100/chart-data')
  .then(response => response.json())
  .then(data => {
    // Customize colors
    const colors = {
      backgroundColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082'], // Red, Black, Teal, Gold, Indigo
      borderColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082']
    };

    // Apply colors to each dataset
    data.datasets.forEach((dataset, index) => {
      dataset.backgroundColor = colors.backgroundColor[index % colors.backgroundColor.length];
      dataset.borderColor = colors.borderColor[index % colors.borderColor.length];
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
              }
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Your Chart Title', // Add your chart title here
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
