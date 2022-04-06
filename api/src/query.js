

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const connect = require('./commons/connection.js');

async function consulta(id) {
  try {

    let contract = await connect.connectNetwork();
    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('readProcessAsset', id);
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    // Disconnect from the gateway.
    //network.disconnect();
   
    return JSON.parse(result);

  } catch (error) {
    console.error('Failed to evaluate transaction:',error);
    process.exit(1);
  }
}
module.exports = {consulta}