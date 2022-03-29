'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');


async function create(object) {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'Org1Wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    const connectionProfilePath = path.resolve(__dirname, '..', 'connection.json');
    const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const connectionOptions = { wallet, identity: 'Org1 Admin', discovery: { enabled: true, asLocalhost: true } };
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('Tutorial');

    // Submit the specified transaction.


    const result = await contract.submitTransaction('createMyAsset', object.assetId, object.value,object.type, object.state, object.owner, object.action,object.engineList, object.associatedDocuments);
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    gateway.disconnect();

     let response= JSON.parse(result);
     let res={
       response
     }
     return res;

  } catch (error) {
    console.error('Failed to submit transaction:',error);
   // process.exit(1);
    let msgResponse= {
        code: 500,
        message: 'Failed to submit transaction:'+error 
    }

    return msgResponse;
  }
}
module.exports = {create}
