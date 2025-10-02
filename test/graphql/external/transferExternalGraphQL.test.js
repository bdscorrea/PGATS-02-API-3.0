//bibliotecas
const request = require('supertest');
const { expect , use } = require('chai');
const sinon = require('sinon');

const chaiExclude = require('chai-exclude');
use(chaiExclude);


      describe('Teste de Transferência GraphQL - External', () => {
        
          before(async () => {
            const loginUser = require('../fixture/request/login/Login.json');
            const loginRes = await request('http://localhost:4000/graphql')
                .post('')
                 .send(loginUser);

       tokenGraphql = loginRes.body.data.login.token;
      });
          
  it('Usuário remetente ou destinatário não encontrado', async () => {
    const transfer = require('../fixture/request/transferencia/transfer.json');
     const resErro = await request('http://localhost:4000/graphql')
      .post('')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send(transfer);

    expect(resErro.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resErro.body.errors[0].message).to.include('Usuário remetente ou destinatário não encontrado');
  });

   it('Transferencia realizada com sucesso', async () => {
    const validaarRespostaDaTransferencia = require('../fixture/respostas/transferencia/validaarRespostaDaTransferencia.json');
    const transfer = require('../fixture/request/transferencia/transfer.json');
    transfer.variables.to = "bea";
    const resTransfer = await request('http://localhost:4000/graphql')
      .post('')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send(transfer)


    expect(resTransfer.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resTransfer.body.data.transfer)
        .excluding('date')
        .to.deep.equal(validaarRespostaDaTransferencia.data.transfer);

        /* expect(resTransfer.body.data.transfer.from).to.equal('teste1');
    expect(resTransfer.body.data.transfer.to).to.equal('bea');
    expect(resTransfer.body.data.transfer.value).to.equal(100);*/
  });

   it('Saldo Insuficiente', async () => {
    const transfer = require('../fixture/request/transferencia/transfer.json');
    transfer.variables.value = 50000.22;
    transfer.variables.to = "bea";
      const resSaldoInsuficiente = await request('http://localhost:4000/graphql')
      .post('')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send(transfer);

    expect(resSaldoInsuficiente.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resSaldoInsuficiente.body.errors[0].message).to.include('Saldo insuficiente');
  });
});

