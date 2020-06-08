/*FIRMWARE DO ARDUINO
  Leitura de dados analógicos e inserção de dados via serial
*/
const int pot = 0;  // porta do potenciometro que vai transmitir os dados
const int led = 8;  // porta do led que vai transmitir os dados
int valor = 0;      // variável que vai armazenar o valor do potenciômetro


void setup() {
  Serial.begin(9600);    //inicializa a comunicação serial a 9600 bits por segundo
  pinMode(led, OUTPUT);  //configura a porta do led como porta de saída de dados
}

void loop() {

// LEITURA DOS DADOS DO POTENCIÔMETRO ATRAVÉS DA PORTA ANALÓGICA A0 DO ARDUINO

  valor = analogRead(pot);  // armazena a leitura da porta A0 e armazenando na variável 'valor'
  Serial.println(valor);    // imprime o valor inteiro 


// ENVIO DE DADOS PARA O LED

  if (Serial.available()) {               //apenas responde quando dados são recebidos na porta serial

    switch(Serial.read()) {               //um interruptor caso a leitura seja a letra 'a' ou 'b'
      
      case 'a':               //Liga o led
        digitalWrite(led, HIGH);
        break;


      case 'b':               //Desliga o led
        digitalWrite(led, LOW);
        break;
        
            }


      }
      delay(100);        // Tempo de atraso para a repetição desse laço de repetição
}