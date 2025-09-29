//bibliotecas
const request = require('supertest');
const { expect } = require('chai');

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
                const token = respostaLogin.body.token;

            //2- realizar a transferência
            const resposta = await request('http://localhost:3000')
                .post('/transfer')
                .set('authorization', `Bearer ${token}`)
                .send({
                    from: "teste1",
                    to: "teste",
                    value: 100
                    });
        console.log(token);
        expect(resposta.status).to.equal(400);
        expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
    });
});
});
