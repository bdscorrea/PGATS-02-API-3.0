//bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

//aplicação
const app = require('../../app');
//MOCK - importar o transfer service
const transferService = require('../../services/transferService');

//testes
describe('Transfer Controller', () => {
    describe('POST /transfer', () => {
        it('Usuário remetente ou destinatário não encontrado - 400', async () => {
            const resposta = await request(app)
                .post('/transfer')
                .send({
                      from: "julio",
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
                .send({
                    from: "teste",
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
                from: "bea",
                to: "bea",
                value: 100
            });

            const resposta = await request(app)
                .post('/transfer')
                .send({
                    from: "bea",
                    to: "bea",
                    value: 100
                });

            expect(resposta.status).to.equal(201);
            //Validação com um Fixture
            const respostaEsperada = require('../fixture/respostas/quandoInformoValoresValidosEuTenhoSucessoCom201Created.json')
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


describe('GET /transfer', () => {
    //its ficam aqui
});