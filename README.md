# MedCert

Sistema web para gestão de atestados médicos, com cadastro de colaboradores, lançamento de atestados e integração com a API oficial da OMS para busca de CIDs.

## Tecnologias Utilizadas
<p align="center">
  <img src="https://nestjs.com/img/logo_text.svg" height="100" alt="NestJS Logo" style="margin-right: 20px;" />
  <img src="https://vuejs.org/images/logo.png" height="100" alt="VueJS Logo" style="margin-right: 20px;" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" height="100" alt="MongoDB Logo" />
</p>

### Backend
  - NestJS como Framework
  - MongoDB utilizando o Mongoose como ORM
  - Validação dos dados dos controllers com class-validator
  - Autenticação utilizando Tokens Http Only

### Frontend
  - VueJS como Framework
  - Validação dos forms com Zod

## Como utilizar

- Primeiramente, deve ser criado arquivos .env da raz das pastas backend e frontend, de acordo com o .env example respectivos de cada pasta
- No caso do backend, tem algumas regras
- - MONGO_INITDB_ROOT_USERNAME= defina uma que deseje
- - MONGO_INITDB_ROOT_PASSWORD= defina uma que deseje
- - MONGODB_URI= a senha deve seguir esse padrao: mongodb://{{MONGO_INITDB_ROOT_USERNAME}}:{{MONGO_INITDB_ROOT_PASSWORD}}@mongodb:27017/medcert-db?authSource=admin
- - SECRET= essa é a senha que vc deve criar para criptografar o JWT
- - NODE_ENV= pode deixar como "development"
- - PORT= pode deixar como "3000"
- - ICD_CLIENT_ID = vai ser pego na sua conta criada na API da OMS
- - ICD_CLIENT_SECRET = vai ser pego na sua conta criada na API da OMS
- - OBS: Algumas informações eu não passaria via README, mas é para faciltiar o usuário.

- No frontend:
- - VITE_API=http://localhost:3000

## Como acesar a API da OMS

- Primeiramente, realize o cadastro nessa URL https://icd.who.int/icdapi/Account/Register
- Ao se conectar, no centro do site, em API Access, vai aparecer um link chamado 'View API access key(s)' e clique nessa, aonde vai ter acesso as credenciais
- com acesso as suas credenciais, coloque na sua viariavel de ambiente do backend

## Como rodar o projeto

- Na raiz de toda aplicação, de o comando docker-compose up
- acesse por aqui: http://localhost:5173/

## Questões tecnicas

- Token JWT válido por 4 horas
- Validador de CPF
- Foi criado um fallback, caso a api da OMS falhe, onde os dados são buscado no banco de dados. Essas informações são salvas e ficam no banco por 30 dias.