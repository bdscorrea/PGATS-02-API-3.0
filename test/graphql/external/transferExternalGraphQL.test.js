//bibliotecas
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../graphql/app');
const transferService = require('../../../services/transferService');
const { loginUser } = require('../../../services/userService');


      describe('Teste de Transferência GraphQL - External', () => {
        
          before(async () => {
            const loginUser = require('../fixture/request/login/Login.json');
            const loginRes = await request('http://localhost:4000/graphql')
                .post('')
                 .send(loginUser);

       tokenGraphql = loginRes.body.data.login.token;
      });
          
  it('Usuário remetente ou destinatário não encontrado', async () => {

     const resErro = await request('http://localhost:4000/graphql')
      .post('')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send({ 
         query:  `
      mutation Transfer($from: String!, $to: String!, $value: Float!) {
            transfer(from: $from, to: $to, value: $value) {
                  date
                  from
                  to
                  value
  }
}
`,
        variables:  {
            from: 'teste1',
            to: 'usuarioInvalido',
            value: 100
        }
  });

    expect(resErro.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resErro.body.errors[0].message).to.include('Usuário remetente ou destinatário não encontrado');
  });

   it('Transferencia realizada com sucesso', async () => {
    const resTransfer = await request('http://localhost:4000/graphql')
      .post('')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send({ 
         query:  `
      mutation Transfer($from: String!, $to: String!, $value: Float!) {
            transfer(from: $from, to: $to, value: $value) {
                  date
                  from
                  to
                  value
  }
}
`,
        variables:  {
            from: 'teste1',
            to: 'bea',
            value: 150
        }
  });
    expect(resTransfer.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resTransfer.body.data.transfer.from).to.equal('teste1');
    expect(resTransfer.body.data.transfer.to).to.equal('bea');
    expect(resTransfer.body.data.transfer.value).to.equal(150);
  });

   it('Saldo Insuficiente', async () => {
      const resSaldoInsuficiente = await request('http://localhost:4000/graphql')
      .post('')
      .set('authorization', `Bearer ${tokenGraphql}`)
      .send({ 
         query:  `
      mutation Transfer($from: String!, $to: String!, $value: Float!) {
            transfer(from: $from, to: $to, value: $value) {
                  date
                  from
                  to
                  value
  }
}
`,
        variables:  {
            from: 'teste1',
            to: 'bea',
            value: 50000.22
        }
  });

    expect(resSaldoInsuficiente.status).to.equal(200); // GraphQL sempre retorna 200, erro vai em errors
    expect(resSaldoInsuficiente.body.errors[0].message).to.include('Saldo insuficiente');
  });
});

