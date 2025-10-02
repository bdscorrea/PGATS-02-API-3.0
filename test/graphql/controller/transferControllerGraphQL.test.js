//bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

 
//aplicação
const app = require('../../../app');
const graphqlApp = require('../../../graphql/app');
//MOCK - importar o transfer service
const transferService = require('../../../services/transferService');

        
        //testes para a API GraphQL
        describe('Teste de Transferência GraphQL- Controller', () => {
             
  it('Usuário remetente ou destinatário não encontrado', async () => {
        const loginMutation = `
      mutation {
        login(username: "teste1", password: "12345") {
          token
        }
      }
    `;
    const loginRes = await request(graphqlApp)
      .post('/graphql')
      .send({ query: loginMutation });

     token = loginRes.body.data.login.token;        
   
    // Tenta transferir para usuário inválido
    const transferMutation = `
      mutation {
        transfer(from: "teste1", to: "usuarioInvalido", value: 100) {
          from
          to
          value
        }
      }
    `;
    const res = await request(graphqlApp)
      .post('/graphql')
      .set('authorization', `Bearer ${token}`)
      .send({ query: transferMutation });

    expect(res.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(res.body.errors[0].message).to.include('Usuário remetente ou destinatário não encontrado');
  });

   it('Transferencia realizada com sucesso', async () => {
    const loginMutation = `
      mutation {
        login(username: "teste1", password: "12345") {
          token
        }
      }
    `;
    const loginRes = await request(graphqlApp)
      .post('/graphql')
      .send({ query: loginMutation });

     token = loginRes.body.data.login.token;  

    const transferMutation = `
      mutation {
        transfer(from: "teste1", to: "bea", value: 150) {
          from
          to
          value
        }
      }
    `;
    const res = await request(graphqlApp)
      .post('/graphql')
      .set('authorization', `Bearer ${token}`)
      .send({ query: transferMutation });

    expect(res.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(res.body.data.transfer.from).to.equal('teste1');
    expect(res.body.data.transfer.to).to.equal('bea');
    expect(res.body.data.transfer.value).to.equal(150);
  });

   it('Saldo Insuficiente', async () => {
    const loginMutation = `
      mutation {
        login(username: "teste1", password: "12345") {
          token
        }
      }
    `;
    const loginRes = await request(graphqlApp)
      .post('/graphql')
      .send({ query: loginMutation });

     token = loginRes.body.data.login.token;  
     
    const transferMutation = `
      mutation {
        transfer(from: "teste1", to: "bea", value: 50000) {
          from
          to
          value
        }
      }
    `;
    const res = await request(graphqlApp)
      .post('/graphql')
      .set('authorization', `Bearer ${token}`)
      .send({ query: transferMutation });

    expect(res.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(res.body.errors[0].message).to.include('Saldo insuficiente');
  });
});

describe('GET /transfer', () => {
    //its ficam aqui
});