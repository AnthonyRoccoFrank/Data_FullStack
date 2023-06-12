// Retrieve data from Flask API
fetch('http://127.0.0.1:5000/vaccine')
  .then(response => response.json())
  .then(data => {
    // Extract the data and labels for the chart
    let chartData = data.map(d => d["Total Doses Distributed"]);
    let chartLabels = data.map(d => d["Week"]);
    // Create the chart
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Total Doses Distributed (per million)',
                data: chartData,
                backgroundColor: 'rgba(0,128,128, .2)',
                borderColor: 'rgba(0,128,128, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  });
