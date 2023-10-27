## Resumo

O código é projetado para inicializar uma conexão Wi-Fi no ESP8266, recuperar informações sobre a rede Wi-Fi conectada e permitir a configuração de redes Wi-Fi por meio de um servidor web. Ele também fornece informações sobre o dispositivo ESP8266, como o endereço MAC, o endereço IP local e outros detalhes.

## Pré-requisitos

Antes de utilizar este código, é necessário ter as seguintes bibliotecas instaladas em seu ambiente Arduino IDE:

- Wire.h
- ESP8266WiFi.h
- ESP8266HTTPClient.h
- WiFiClient.h
- ArduinoJson.h
- ESP8266WebServer.h
- EEPROM.h

## Variáveis Globais

- `ssid`: O SSID da rede Wi-Fi à qual o dispositivo deve se conectar.
- `passphrase`: A senha da rede Wi-Fi à qual o dispositivo deve se conectar.
- `host`: O host da API do GitHub.
- `localIP`: Uma string que armazena o endereço IP local do dispositivo.
- `connectedNetwork`: Uma string que armazena o nome da rede Wi-Fi à qual o dispositivo está conectado.
- `st`: Uma string usada para armazenar informações temporárias.
- `content`: Uma string usada para armazenar o conteúdo da resposta do servidor.

## Funções

- `testWifi()`: Esta função verifica se o dispositivo está conectado a uma rede Wi-Fi especificada.
- `launchWeb()`: Inicializa um servidor web para configuração da rede Wi-Fi.
- `setupAP()`: Configura um ponto de acesso (AP) se a conexão Wi-Fi não puder ser estabelecida.
- `setup()`: A função `setup` inicializa a conexão Wi-Fi e chama outras funções de acordo com a situação.
- `loop()`: A função `loop` é chamada repetidamente e lida com a lógica do servidor web.
- `createWebServerCO()`: Configura rotas para obter informações da rede Wi-Fi conectada.
- `createWebServer()`: Configura rotas para obter informações sobre redes Wi-Fi disponíveis e permite a configuração da rede.
- `getDeviceInfo()`: Obtém informações do dispositivo ESP8266, como MAC, IP, versão do SDK, entre outras.

## Rotas

### Rota "/networkinfo"

Esta rota é usada para obter informações da rede Wi-Fi à qual o dispositivo ESP8266 está atualmente conectado. Quando você acessa essa rota, o dispositivo responde com um JSON contendo o SSID da rede e a intensidade do sinal (RSSI).

Exemplo de resposta JSON:
```json
{
  "ssid": "NomeDaRedeWiFi",
  "rssi": -60
}
```

### Rota "/networks"

Esta rota é usada para obter informações sobre as redes Wi-Fi disponíveis no ambiente. O dispositivo faz uma varredura das redes Wi-Fi ao redor e retorna os resultados em formato JSON. As informações incluem o SSID da rede, a intensidade do sinal (RSSI) e o tipo de criptografia da rede.

Exemplo de resposta JSON:
```json
{
  "networks": [
    {
      "ssid": "Rede1",
      "rssi": -70,
      "encryption": 2
    },
    {
      "ssid": "Rede2",
      "rssi": -80,
      "encryption": 4
    }
  ]
}
```

O campo "encryption" representa o tipo de criptografia da rede:
- 0: Sem criptografia
- 2: WPA_PSK
- 4: WPA2_PSK
- 7: WEP

### Rota "/setting"

Esta rota permite configurar a rede Wi-Fi à qual o dispositivo se conectará. Você pode enviar parâmetros via uma solicitação HTTP POST para esta rota. Os parâmetros incluem "ssid" (SSID da rede Wi-Fi) e "pass" (senha da rede Wi-Fi). Se os parâmetros forem fornecidos corretamente, o dispositivo armazena essas informações na EEPROM e reinicia.

O status da resposta HTTP depende do sucesso da operação:
- Se a configuração for bem-sucedida, o dispositivo retornará um JSON com status 200 e uma mensagem de sucesso. Após isso, o dispositivo reiniciará para aplicar as novas configurações.
- Se a configuração falhar (por exemplo, parâmetros em falta ou incorretos), o dispositivo retornará um status 404 com uma mensagem de erro.

Exemplo de solicitação POST (via cURL):
```bash
curl -X POST "http://ESP8266-IP-ADDRESS/setting?ssid=MyNetwork&pass=MyPassword"
```

Exemplo de resposta JSON bem-sucedida:
```json
{
  "message": "defined wifi network",
  "ssid": "MyNetwork"
}
```

Exemplo de resposta JSON com falha:
```json
{
  "msg": "wifi network not defined"
}
```

### Rota "/deviceinfo"

Esta rota retorna informações gerais sobre o dispositivo ESP8266. Ela fornece detalhes como o endereço MAC, o endereço IP local, o ID do chip, a versão do SDK, a versão do firmware, a tensão de alimentação e os endereços de gateway e DNS.

Exemplo de resposta JSON:
```json
{
  "macAddress": "XX:XX:XX:XX:XX:XX",
  "localIP": "192.168.0.100",
  "chipID": 12345678,
  "flashChipID": 87654321,
  "flashChipSize": 4096,
  "sdkVersion": "3.0.0-dev(c55c24f)",
  "firmwareVersion": "ABC123",
  "voltage": 3.34,
  "gatewayIP": "192.168.0.1",
  "dnsIP": "8.8.8.8"
}
```

Essas rotas permitem controlar e configurar o dispositivo ESP8266 por meio de uma interface web. Certifique-se de entender a funcionalidade de cada rota antes de utilizá-las em seu projeto.

## Uso

1. Carregue o código em um dispositivo ESP8266 usando a plataforma Arduino IDE ou outra compatível com ESP8266.
2. Certifique-se de que as bibliotecas necessárias estejam instaladas.
3. Conecte o ESP8266 à alimentação.
4. O dispositivo tentará se conectar à rede Wi-Fi especificada no `ssid` e `passphrase`. Se a conexão for bem-sucedida, o dispositivo fornecerá informações sobre a rede através de uma API web.

5. Se o botão de reset for pressionado durante a inicialização, o dispositivo iniciará um servidor web para a configuração da rede Wi-Fi. Nesse modo, você pode acessar as rotas `/networks` para visualizar redes disponíveis e `/setting` para configurar a rede Wi-Fi.

## Avisos

- Certifique-se de manter as informações de rede Wi-Fi seguras, pois elas são armazenadas na EEPROM do dispositivo.
- O uso deste código implica que o dispositivo permitirá a configuração de redes Wi-Fi sem autenticação, o que pode representar um risco de segurança. Certifique-se de que a segurança seja tratada adequadamente no contexto do seu projeto.

Lembre-se de que esta é uma documentação básica do código fornecido. Dependendo do seu projeto, você pode precisar de mais informações sobre as funções específicas e como utilizá-las. Certifique-se de revisar e ajustar o código para atender aos requisitos do seu projeto e garantir que a segurança seja tratada adequadamente.
