//bibliotecas
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const transferService = require('../../../services/transferService');



//
console.log("\n");
describe('Teste de Transferência Rest - External', () => {
    beforeEach(async () => {
            const respostaLogin = await request('http://localhost:3000')
                    .post('/users/login')
                    .send({
                            username: 'teste1',
                             password: '12345'
                           });

            token = respostaLogin.body.token;
        });
        it('Usuário remetente ou destinatário não encontrado - 400', async () => {
                
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

     it('Transferência realizada. - 201', async () => {
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
