'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const connect = require('./commons/connection.js');


async function update(object) {
  try {

    // Get the contract from the network.
    let contract = await connect.connectNetwork();

    // update the specified transaction.
    const result = await contract.submitTransaction('updateProcessAsset', object.assetId, object.code,object.type, object.state, object.owner, object.action,object.engineList, object.associatedDocuments);
    console.log('Transaction has been updated');

    // Disconnect from the gateway.
   // gateway.disconnect();

     let response= JSON.parse(result);
    
     return response;

  } catch (error) {
    console.error('Failed to update transaction:',error);
    let msgResponse= {
        codigo: 500,
        mensaje: 'Failed to update transaction:'+error 
    }

    return msgResponse;
  }
}
module.exports = {update}
