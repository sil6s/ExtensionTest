window.onload = function() {
  const errorDiv = document.getElementById('errorDiv');
  const chartCanvas = document.getElementById('myChart');
  const ctx = chartCanvas.getContext('2d');

  // Initially hide the error div and chart canvas
  errorDiv.style.display = 'none';
  chartCanvas.style.display = 'none';

  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
      // Chart.js not loaded scenario
      errorDiv.style.display = 'block';
      document.title = "503: Server Error";
      console.error('Chart.js not loaded');
  } else {
      // Chart.js is loaded, proceed with fetching chart data
      fetch('http://localhost:3100/chart-data')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              console.log('Chart data fetched successfully:', data);

              const barChartData = data.barChartData;

              // Customize colors
              const colors = {
                  backgroundColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082', '#00FF00', '#0000FF', '#800080', '#FFA500', '#808080'],
                  borderColor: ['#FF0000', '#000000', '#008080', '#FFD700', '#4B0082', '#00FF00', '#0000FF', '#800080', '#FFA500', '#808080']
              };

              // Apply colors to each dataset
              barChartData.datasets.forEach((dataset, index) => {
                  dataset.backgroundColor = colors.backgroundColor[index % colors.backgroundColor.length];
                  dataset.borderColor = colors.borderColor[index % colors.borderColor.length];
              });

              // Show the chart canvas
              chartCanvas.style.display = 'block';

              // Create the chart
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
                                      size: 16
                                  }
                              },
                              title: {
                                  display: true,
                                  text: 'Usernames:',
                                  font: {
                                      size: 20
                                  }
                              }
                          },
                          y: {
                              stacked: true,
                              ticks: {
                                  font: {
                                      size: 16
                                  },
                                  callback: function(value) {
                                      return value + ' hrs';
                                  }
                              },
                              title: {
                                  display: true,
                                  text: 'Time (hours)',
                                  font: {
                                      size: 20
                                  }
                              },
                              beginAtZero: true
                          }
                      },
                      plugins: {
                          title: {
                              display: true,
                              text: 'Top Ten Users by Time Spent',
                              font: {
                                  size: 24
                              }
                          },
                          legend: {
                              display: true,
                              labels: {
                                  font: {
                                      size: 16
                                  }
                              },
                              title: {
                                  display: true,
                                  text: 'Github Issue:',
                                  font: {
                                      size: 18
                                  }
                              }
                          }
                      }
                  }
              });
          })
          .catch(error => {
              // Error handling for fetch operation
              console.error('Error fetching chart data:', error);
              errorDiv.style.display = 'block';
              document.title = "503: Server Error";
          });
  }
};
