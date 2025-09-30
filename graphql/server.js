//const app = require('./app');

const app = require('../../graphql/app');
const PORT = process.env.GRAPHQL_PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL server running on port ${PORT}`);
});
