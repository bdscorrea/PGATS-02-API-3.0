//bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

 
//aplicação
const app = require('../../app');
const graphqlApp = require('../../graphql/app');
//MOCK - importar o transfer service
const transferService = require('../../services/transferService');

//testes
describe('Transfer Controller', () => {
    describe('POST /transfer', () => {
        beforeEach(async () => {
            const respostaLogin = await request(app)
                    .post('/users/login')
                    .send({
                            username: 'teste1',
                             password: '12345'
                           });

            token = respostaLogin.body.token;
        });
        
        it('Usuário remetente ou destinatário não encontrado - 400', async () => {
            const resposta = await request(app)
                .post('/transfer')
                .set('authorization', `Bearer ${token}`)
                .send({
                      from: "teste1",
                      to: "priscila",
                      value: 200
                    });
    
        expect(resposta.status).to.equal(400);
        expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
        });

        it('Usando Mocks: Usuário remetente ou destinatário não encontrado - 400', async () => {
            //mocar apenas a função transfers do Service
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.returns({ error: 'Usuário remetente ou destinatário não encontrado' });

            const resposta = await request(app)
                .post('/transfer')
                .set('authorization', `Bearer ${token}`)
                .send({
                    from: "teste1",
                    to: "priscila",
                    value: 200
                });
    
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado');
            
            sinon.restore();
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

            const resposta = await request(app)
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

            //um expert para comparar a Resposta.body com a String contida no arquivo 
            //expect(resposta.body).to.have.property('from', 'bea');
            //expect(resposta.body).to.have.property('to', 'bea');
            //expect(resposta.body).to.have.property('value', 100);

            //console.log(resposta.body)
            
            //RESETO O MMOCK
            sinon.restore();
        });
});
});

        //testes para a API GraphQL
        describe('GraphQL API', () => {
             
  it('API GraphQL: Usuário remetente ou destinatário não encontrado', async () => {
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

   it('API GraphQL: Transferencia realizada com sucesso', async () => {
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

   it('API GraphQL: Saldo Insuficiente', async () => {
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