const socket = io();        // chamada da biblioteca do socket.io, presente no index.html

let counter = 0.1;          //contador que orienta o eixo X - intervalo de tempo para emitir dados do/para Arduino (100 milisegundos)

socket.on('serialData', function(dataSerial){       // configura o socket para receber o evento 'serialData'; cria função que usa 'dataSerial'
    console.log(dataSerial);                        // imprime no log da console os valores recebidos pela serial
    myChart.data.labels.push(counter);              // preeche o eixo X com os valores do contador de tempo (*)
    myChart.data.datasets.forEach(dataset => [
        dataset.data.push(dataSerial.value),        // para cada novo dado recebido pela serial, atribui os valores no dataset 'data' no gráfico (**)
        console.log(dataSerial.value)               // imprime os valores recebidos pela serial no log da console
    ]);
    counter = counter + 0.1                         // incrementa o o contador, em mais 100 milissegundos
    myChart.update();                               // atualiza informações no gráfico
});



var ctx = document.getElementById('grafico').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Tempo (100ms)'],                  // (*)
        datasets: [{
            label: 'Serial',
            data: [],                               // (**)
            backgroundColor: [
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});