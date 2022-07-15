

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const connect = require('./commons/connection.js');

async function consulta(id) {
  try {
    // Get the contract from the network.
    let contract = await connect.connectNetwork();
    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('readVoteAsset', id);
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

   
    return JSON.parse(result);

  } catch (error) {
    console.error('Failed to evaluate transaction:',error);
    let msgResponse= {
        codigo: 500,
        mensaje: 'Failed to update transaction:'+error 
    }
    return msgResponse;
  }
}
module.exports = {consulta}