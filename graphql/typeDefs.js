const { gql } = require('graphql-tag');

module.exports = gql`
  type User {
    username: String!
    favorecido: Boolean!
    saldo: Float!
  }
  type Transfer {
    from: String!
    to: String!
    value: Float!
    date: String!
  }
  type AuthPayload {
    user: User!
    token: String!
  }
  type Query {
    users: [User!]!
    transfers: [Transfer!]!
  }
  type Mutation {
    register(username: String!, password: String!, favorecido: Boolean): User!
    login(username: String!, password: String!): AuthPayload!
    transfer(from: String!, to: String!, value: Float!): Transfer!
  }
`;
