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
    const result = await contract.submitTransaction('updateDocumentAsset',  object.assetId, object.description,object.type, object.state, object.owner, object.action);
    console.log('Transaction has been updated');

    // Disconnect from the gateway.
   // gateway.disconnect();

     let response= JSON.parse(result);
     let res={
       response
     }
     return res;

  } catch (error) {
    console.error('Failed to update transaction:',error);
    let msgResponse= {
        code: 500,
        message: 'Failed to update transaction:'+error 
    }

    return msgResponse;
  }
}
module.exports = {update}
