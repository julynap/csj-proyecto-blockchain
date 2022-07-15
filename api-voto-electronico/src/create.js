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
    const result = await contract.submitTransaction('createVoteAsset', 
    object.id,
    object.nombre,
    object.estado,
    object.fecha,
    object.votantes,
    object.estadoVotantes,
    object.numeroRondas,
    object.tipoVotantes,
    object.eleccionCandidatos,
    object.eleccionJudicial
    );

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
