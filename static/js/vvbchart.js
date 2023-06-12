var ctx = document.getElementById('myChart').getContext('2d');

// Fetch data from Flask API endpoints
fetch("http://127.0.0.1:5000/flu")
    .then(response => response.json())
    .then(data => {
        let symIllnesses = [];
        let years = [];
        data.forEach(function(data) {
            //let groupYear = _.groupBy(data,'year')
            //console.log(groupYear)
            symIllnesses.push(data["Symptomatic Illnesses (Estimate)"]);
            years.push(data["Year"]);
        });
        // Divide the data by 100,000 to get it in hundred thousands
        for (let i = 0; i < symIllnesses.length; i++) {
            symIllnesses[i] = symIllnesses[i]/100000;
        }
        fetch("http://127.0.0.1:5000/vaccine")
            .then(response => response.json())
            .then(data => {
                let doses = [];
                data.forEach(function(data) {
                    doses.push(data["Total Doses Distributed"]);
                });
                let myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: years,
                        datasets: [{
                            label: 'Symptomatic Illnesses Estimate (per 100,000)',
                            data: symIllnesses,
                            backgroundColor: 'rgba(32,178,170,0.75)',
                            borderColor: 'rgba(32,178,170, 1)',
                            borderWidth: 1,
                            yAxisID: 'y-axis-1'
                        },
                        {
                            label: 'Total Doses Distributed',
                            data: doses,
                            type: 'line',
                            borderColor: 'teal',
                            backgroundColor: 'teal',
                            fill: false,
                            yAxisID: 'y-axis-2'
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                id: 'y-axis-1',
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value
                                    },
                                    fontColor: 'rgba(32,178,170, 1)',
                                }
                            },
                            {
                                id: 'y-axis-2',
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value
                                    },
                                    fontColor: 'teal',
                                }
                            }]
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    var dataset = data.datasets[tooltipItem.datasetIndex];
                                    if (dataset.type === 'line') {
                                        label += tooltipItem.yLabel;
                                    } else {
                                        label += Math.round(tooltipItem.yLabel * 100000).toLocaleString();
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                });
            });
    });
