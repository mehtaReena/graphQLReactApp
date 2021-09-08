import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { ApolloClient,InMemoryCache } from "@apollo/client";
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: " https://todo-app-graplhql.herokuapp.com/graphql" ,
  cache: new InMemoryCache()
});

ReactDOM.render(
<ApolloProvider client={client}>
  <App />
</ApolloProvider>,
  document.getElementById('root')
  );


