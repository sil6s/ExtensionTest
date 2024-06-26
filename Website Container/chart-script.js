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

    // Function to calculate total time spent for a dataset
    const calculateTotalTime = (dataset) => {
      return dataset.data.reduce((acc, curr) => acc + parseFloat(curr), 0);
    };

    // Remove datasets where total time spent is 0
    data.datasets = data.datasets.filter(dataset => calculateTotalTime(dataset) > 0);

    // Sort datasets by total time spent (descending order)
    data.datasets.sort((a, b) => {
      return calculateTotalTime(b) - calculateTotalTime(a);
    });

    // Select top ten datasets (users) by time spent
    const topTenDatasets = data.datasets.slice(0, 10);

    // Update data with top ten datasets
    data.datasets = topTenDatasets;

    // Customize colors
    const colors = {
      backgroundColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082', '#00FF00', '#0000FF', '#800080', '#FFA500', '#808080'], // Colors for top 10 users
      borderColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082', '#00FF00', '#0000FF', '#800080', '#FFA500', '#808080']
    };

    // Apply colors to each dataset
    data.datasets.forEach((dataset, index) => {
      dataset.backgroundColor = colors.backgroundColor[index];
      dataset.borderColor = colors.borderColor[index];
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
            }
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
