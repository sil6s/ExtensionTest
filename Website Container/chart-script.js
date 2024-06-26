fetch('http://localhost:3100/chart-data')
  .then(response => response.json())
  .then(data => {
    // Function to convert seconds to hours
    const secondsToHours = (seconds) => {
      return (seconds / 3600).toFixed(2); // Convert seconds to hours with two decimal places
    };

    // Convert seconds to hours for relevant data
    data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(secondsToHours); // Assuming 'data' property contains seconds
    });

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
              },
              // Callback function to append 'hr' to y-axis labels
              callback: function(value, index, values) {
                return value + ' hrs'; // Append 'hr' to each value
              }
            },
            // Assuming y-axis represents hours, you can customize further if needed
            // Example:
            // title: {
            //   display: true,
            //   text: 'Time (hours)',
            //   font: {
            //     size: 20 // Font size for the y-axis label
            //   }
            // }
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
