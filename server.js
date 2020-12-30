const fs = require('fs');
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); //helps in logging
const errorHandler = require('./middleware/error');
const colors = require('colors');
const connectDB = require('./config/db');

// load env vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Route files
const items = require('./routes/items');

const app = express();

// body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/items', items);

app.use(errorHandler);

// graphql support
const typeDefs = gql(fs.readFileSync('./schema.graphql', { encoding: 'utf8' }));
const resolvers = require('./resolvers');
const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode in port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server and exit process
  server.close(() => process.exit(1));
});
