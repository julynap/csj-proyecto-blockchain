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
    const result = await contract.submitTransaction('createProcessAsset', object.assetId, object.code,object.type, object.state, object.owner, object.action,object.engineList, object.associatedDocuments);
    console.log('Transaction has been submitted');

     let response= JSON.parse(result);
     let res={
       response
     }
     return res;

  } catch (error) {
    console.error('Failed to submit transaction:',error);
    let msgResponse= {
        code: 500,
        message: 'Failed to submit transaction:'+error 
    }

    return msgResponse;
  }
}
module.exports = {create}
