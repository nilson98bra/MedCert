# MedCert

Sistema web para gestão de atestados médicos, com cadastro de colaboradores, lançamento de atestados e integração com a API oficial da OMS para busca de CIDs.

## Tecnologias Utilizadas
<p align="center">
  <img src="https://nestjs.com/img/logo_text.svg" height="100" alt="NestJS Logo" style="margin-right: 20px;" />
  <img src="https://vuejs.org/images/logo.png" height="100" alt="VueJS Logo" style="margin-right: 20px;" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" height="100" alt="MongoDB Logo" />
</p>

### Backend
- NestJS como framework
- MongoDB utilizando o Mongoose como **ORM**
- Validação dos dados dos controllers com **class-validator**
- Autenticação utilizando tokens **HttpOnly**

### Frontend
- Vue.js como framework
- Validação dos formulários com **Zod**

## Como utilizar

- Crie os arquivos `.env` na **raiz** das pastas `backend` e `frontend`, de acordo com o `.env.example` respectivo de cada pasta.

- No **backend**, configure:
  - `MONGO_INITDB_ROOT_USERNAME=` defina o usuário desejado
  - `MONGO_INITDB_ROOT_PASSWORD=` defina a senha desejada
  - `MONGODB_URI=` use o padrão:
    ```
    mongodb://{{MONGO_INITDB_ROOT_USERNAME}}:{{MONGO_INITDB_ROOT_PASSWORD}}@mongodb:27017/medcert-db?authSource=admin
    ```
  - `SECRET=` senha que você deve criar para assinar/criptografar o JWT
  - `NODE_ENV=` pode deixar como `"development"`
  - `PORT=` pode deixar como `"3000"`
  - `ICD_CLIENT_ID=` obtido na sua conta da API da OMS
  - `ICD_CLIENT_SECRET=` obtido na sua conta da API da OMS  
  - **Observação:** Algumas dessas informações normalmente não seriam expostas em um README, mas estão aqui para facilitar a configuração.

- No **frontend**:
  - `VITE_API=http://localhost:3000`

## Como acessar a API da OMS

- Cadastre-se em: https://icd.who.int/icdapi/Account/Register  
- Após o login, em **API Access**, clique em **View API access key(s)** para visualizar suas credenciais.  
- Com as credenciais em mãos, preencha as variáveis de ambiente no backend.

## Como rodar o projeto

- Na raiz da aplicação, execute: docker-compose up
- Acesse pelo navegador: http://localhost:5173/

## Questões técnicas

- Token JWT válido por **4 horas**
- Validador de **CPF**
- **Fallback** implementado: caso a API da OMS falhe, os dados são buscados no banco de dados. As informações são salvas e permanecem disponíveis por **30 dias**.

