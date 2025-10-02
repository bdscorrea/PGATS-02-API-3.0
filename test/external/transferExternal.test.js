//bibliotecas
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../graphql/app');
const transferService = require('../../services/transferService');



//testes
describe('Transfer Controller External', () => {
    describe('POST /transfer', () => {
        it('External: Usuário remetente ou destinatário não encontrado - 400', async () => {
   //1- capturar o token
                const respostaLogin = await request('http://localhost:3000')
                .post('/users/login')
                .send({
                    username: 'teste1',
                    password: '12345'
                });
                 token = respostaLogin.body.token;

            //2- realizar a transferência
            const resposta = await request('http://localhost:3000')
                .post('/transfer')
                .set('authorization', `Bearer ${token}`)
                .send({
                    from: "teste1",
                    to: "teste",
                    value: 100
                    });

        expect(resposta.status).to.equal(400);
        expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
    });

     it('Usando Mocks: Transferência realizada. - 201', async () => {
           //mocar apenas a função transfers do Service
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.returns({ 
                from: "teste1",
                to: "bea",
                value: 100,
                date: new Date().toISOString()
            });

            const resposta = await request('http://localhost:3000')
                .post('/transfer')
                .set('authorization', `Bearer ${token}`)
                .send({
                    from: "teste1",
                    to: "bea",
                    value: 100
                });

            expect(resposta.status).to.equal(201);

            //Validação com um Fixture
            const respostaEsperada = require('../fixture/respostas/quandoInformoValoresValidosEuTenhoSucessoCom201Created.json');
            delete resposta.body.date;
            delete respostaEsperada.date;
            expect(resposta.body).to.deep.equal(respostaEsperada);
            
            //RESETO O MMOCK
            sinon.restore();
        });
}); 

        //testes para a API GraphQL
        describe('GraphQL API', () => {
          beforeEac(() => {
            
          }
          )
  it('API GraphQL: Usuário remetente ou destinatário não encontrado', async () => {

    // Primeiro, obtenha o token
    const loginRes = await request('http://localhost:4000/graphql')
      .post('/graphql')
      .send({ 
              query: `
      mutation {
        login(username: "teste1", password: "12345") {
          token
        }
      }
    `
      });
    const tokenGraphql = loginRes.body.data.login.token;

    const resErro = await request('http://localhost:4000/graphql')
      .post('/graphql')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send({ 
         query:  `
      mutation {
        transfer(from: "teste1", to: "usuarioInvalido", value: 100) {
          from
          to
          value
        }
      }
    `
  });

    expect(resErro.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resErro.body.errors[0].message).to.include('Usuário remetente ou destinatário não encontrado');
  });

   it('API GraphQL: Transferencia realizada com sucesso', async () => {
    // Primeiro, obtenha o token
   const loginRes = await request('http://localhost:4000/graphql')
      .post('/graphql')
      .send({ query: 
         `
      mutation {
        login(username: "teste1", password: "12345") {
          token
        }
      }
    `
       });
    const tokenGraphql = loginRes.body.data.login.token;

    const resTransfer = await request('http://localhost:4000/graphql')
      .post('/graphql')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send({ query: 
        `
      mutation {
        transfer(from: "teste1", to: "bea", value: 150) {
          from
          to
          value
        }
      }
    `
       });

    expect(resTransfer.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resTransfer.body.data.transfer.from).to.equal('teste1');
    expect(resTransfer.body.data.transfer.to).to.equal('bea');
    expect(resTransfer.body.data.transfer.value).to.equal(150);
  });

   it('API GraphQL: Saldo Insuficiente', async () => {
    const loginRes = await request('http://localhost:4000/graphql')
      .post('/graphql')
      .send({ query: 
        `
      mutation {
        login(username: "teste1", password: "12345") {
          token
        }
      }
    `
       });
    const tokenGraphql = loginRes.body.data.login.token;


    const resSaldoInsuficiente = await request('http://localhost:4000/graphql')
      .post('/graphql')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send({ query: 
        `
      mutation {
        transfer(from: "teste1", to: "bea", value: 50000.22) {
          from
          to
          value
        }
      }
    `
           });

    expect(resSaldoInsuficiente.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resSaldoInsuficiente.body.errors[0].message).to.include('Saldo insuficiente');
  });
});
});
