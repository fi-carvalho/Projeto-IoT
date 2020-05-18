//importando bibliotecas
const SerialPort = require('serialport')
const express = require('express')
const socketIo = require('socket.io')
const http = require('http')


// criar o servidor web
const app = express();
const server = http.createServer(app);

app.use(express.static('public'));  //o express precisa saber que existe uma pasta com arquivos estáticos

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html') //publicação da página
});

server.listen(9999, () => {
    console.log('Acesso no localhost ou pelo IP 192.168.1.166 na porta: %d', server.address().port);
});

const io = socketIo.listen(server); //ouve as requisições web


// configuração da serialport do arduino, enviando dados para página da web
const Readline = require('@serialport/parser-readline') //biblioteca que lê os dados que entram pela porta serial, linha por linha
const usbport = new SerialPort('/dev/ttyACM0')          // configura a porta USB do PC conectada com o Arduino
const parser = usbport.pipe(new Readline({ delimiter: '\r\n' }))        // canaliza os dados enviados pela serial, através do USB, analisando linha por linha

usbport.on('open', function(){              // abre a conexão na porta usb
    console.log('Conexão iniciada...');
    parser.on('data', function (dadoPot) {  // analisa os dados enviados pelo potenciômetro, pela serial
        console.log(dadoPot);               //escreve os dados lidos no log da console
        var dadoFinal = parseInt(((dadoPot*100)/1023)); //transforma dados do potenciômetro, lidos pela serial, em um inteiro, convertendo em porcentagem (1023 = 100%)
        console.log(dadoFinal);
        io.emit('serialData', {             // chamada do evento, batizado de 'serialData'
            value: dadoFinal.toString()     // emite o dado do potenciômetro, transformado em porcentagem, para o log da console (formato de string)
        });
     });
});


// configuração para receber dados da web e enviar para a serialport do Arduino
io.sockets.on('connection', function (socket) { 
   console.log('Um novo nó foi conectado');
   
   socket.on('btnAction', function (btn) {          // faz com que os botões funcionem, a partir da classe html 'btn' e do valor atribuído em 'value'
    var dadoBotaoWeb = btn.value;                   // pega os valores dos botões e gravam em uma variável dadoBotaoWeb
    console.log(dadoBotaoWeb);                      // imprime o valor atribuido ao dadoBotaoWeb no log da console
    usbport.write(dadoBotaoWeb);                    // envia para o arduino o valor atribuido, usando a porta serial
    console.log('Enviando sinal >>' + dadoBotaoWeb + '<< para o Led.');     // imprime no log da serial o valor enviado para o arduino
    })
 })