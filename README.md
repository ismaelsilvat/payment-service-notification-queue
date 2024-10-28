# Notification and Payment Services

Este projeto consiste em dois serviços principais: `notification-service` e `payment-service`. Eles se comunicam através de filas do RabbitMQ para processar pagamentos e enviar notificações.

## Índice

- [Requisitos](#requisitos)
- [Executando com Docker](#executando-com-docker)
- [Testando a Aplicação](#testando-a-aplicação)
- [Acessando o RabbitMQ](#acessando-o-rabbitmq)
- [Acessando o Banco de Dados](#acessando-o-banco-de-dados)
- [Encerrando os Contêineres](#encerrando-os-contêineres)

## Requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados na sua máquina:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instalação e Configuração

### 1. Executando com Docker

docker-compose up --build

### 2. Acessando as aplicações

payment-service: http://localhost:3000
notification-service: http://localhost:3001 (não contém resposta pois não se trata de um servidor http)

### 3. Verificando se os contêineres estão rodando

docker ps

Você deve ver algo como:
CONTAINER ID   IMAGE                           COMMAND                  CREATED        STATUS        PORTS                              NAMES
1f4a678b1c63   notification-service            "docker-entrypoint.s…"   2 minutes ago  Up 2 minutes  0.0.0.0:3001->3001/tcp             notification-service
3b6b1c34e23a   payment-service                 "docker-entrypoint.s…"   2 minutes ago  Up 2 minutes  0.0.0.0:3000->3000/tcp             payment-service
89b1a23b9f83   rabbitmq:3-management           "docker-entrypoint.s…"   2 minutes ago  Up 2 minutes  0.0.0.0:15672->15672/tcp, 5672/tcp rabbitmq
77f34e9f23d3   postgres                        "docker-entrypoint.s…"   2 minutes ago  Up 2 minutes  0.0.0.0:5432->5432/tcp             postgres


Aqui está uma versão aprimorada do texto:

---

### 4. Teste da aplicação

Você pode testar a aplicação utilizando ferramentas como Postman ou Insomnia, enviando o seguinte payload para o endpoint:

Endpoint: `http://localhost:3000/payments`  
Payload:
```json
{
  "userId": 1,
  "amount": 100.00
}
```

Alternativamente, você pode usar o comando `curl` para executar a requisição diretamente via linha de comando:

```bash
curl -X POST http://localhost:3000/payments -H "Content-Type: application/json" -d '{
  "userId": 1,
  "amount": 100.00
}'
```

---

### 5. Testando o notification-service
O notification-service escuta eventos da fila do RabbitMQ e envia notificações. Certifique-se de que ele está funcionando corretamente verificando os logs do contêiner:

docker logs notification-service

### 6. Acessando o RabbitMQ
O RabbitMQ possui uma interface de gerenciamento que pode ser acessada em:

http://localhost:15672
As credenciais padrão são:

Usuário: guest
Senha: guest


### 7. Acessando o Banco de Dados
O PostgreSQL pode ser acessado diretamente para consultar ou manipular dados. Para isso, você pode utilizar o comando docker exec:

docker exec -it challenge-02-postgres-1 psql -U myuser -d mydb (possivelmente você terá que substituir o nome do container pelo que foi exibido no comando docker ps, no passo 3.)
Dentro do console do psql, você pode executar comandos SQL como:

SELECT * FROM payment;
SELECT * FROM notification;

### 8. Encerrando os Contêineres
Para parar e remover os contêineres, basta executar o seguinte comando:

docker-compose down

