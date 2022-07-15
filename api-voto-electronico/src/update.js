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
    const result = await contract.submitTransaction('updateVoteAsset', 
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

     console.log('Transaction has been updated');

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
