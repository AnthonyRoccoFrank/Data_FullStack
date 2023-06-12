const ctx = document.getElementById('myChart').getContext('2d');

let xLabels = [];
let ySymptomatic = [];
let yHospitalizations = [];
let yDeaths = [];

fetch('http://127.0.0.1:5000/flu')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            xLabels.push(item.Year);
            ySymptomatic.push(item["Symptomatic Illnesses (Estimate)"] / 1000000);
            yHospitalizations.push(item["Hospitalizations (Estimate)"] / 1000000);
            yDeaths.push(item["Deaths (Estimate)"] / 1000000);
        });

        const stackedBar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: xLabels,
                datasets: [{
                    label: 'Symptomatic Illnesses Estimate',
                    data: ySymptomatic,
                    backgroundColor: 'teal'
                }, {
                    label: 'Hospitalizations Estimate',
                    data: yHospitalizations,
                    backgroundColor: 'lightseagreen'
                }, {
                    label: 'Death Estimate',
                    data: yDeaths,
                    backgroundColor: 'mediumturquoise'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function (value) {
                                return value
                            },
                            stacked: true
                        }
                    }]
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += new Intl.NumberFormat().format(tooltipItem.yLabel * 1000000);
                            return label;
                        }
                    }
                }
            }
        });
    });
