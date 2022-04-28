'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const connect = require('./commons/connection.js');


async function create(object) {
  try {

    // Get the contract from the network.
    let contract = await connect.connectNetwork();

    // Submit the specified transaction.
    const result = await contract.submitTransaction('createDocumentAsset', object.assetId, object.description,object.type, object.state, object.owner, object.action);
    console.log('Transaction has been submitted');

     let response= JSON.parse(result);
     
     return response;

  } catch (error) {
    console.error('Failed to submit transaction:',error);
    let msgResponse= {
      codigo: 500,
      mensaje: 'Failed to submit transaction:'+error 
  }

    return msgResponse;
  }
}
module.exports = {create}
