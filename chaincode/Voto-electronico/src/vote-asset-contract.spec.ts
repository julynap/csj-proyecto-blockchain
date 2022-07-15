/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { VoteAssetContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logger = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('VoteAssetContract', () => {

    let contract: VoteAssetContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new VoteAssetContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my asset 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my asset 1002 value"}'));
    });

    describe('#voteAssetExists', () => {

        it('should return true for a my asset', async () => {
            await contract.voteAssetExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a my asset that does not exist', async () => {
            await contract.voteAssetExists(ctx, '1003').should.eventually.be.false;
        });

    });


    describe('#createVoteAsset', () => {
      
        it('should create a my asset', async () => {
            
            
            await contract.createVoteAsset(ctx, 
              '1003', 
              'nombre votante',
              'creado', 
              '2022-05-11', 
              'andres', 
              'votando',
              '10',
              'electronico',
              'candidateElection',
              'judicialElection',);
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"my asset 1003 value"}'));
        });

        it('should throw an error for a my asset that already exists', async () => {
            
            await contract.createVoteAsset(ctx, 
              '1003', 
              'nombre votante',
              'creado', 
              '2022-05-11', 
              'andres', 
              'votando',
              '10',
              'electronico',
              'candidateElection',
              'judicialElection',).should.be.rejectedWith(/The my asset 1001 already exists/);
        });

    });

    describe('#readVoteAsset', () => {

        it('should return a my asset', async () => {
            await contract.readVoteAsset(ctx, '1001').should.eventually.deep.equal({ value: 'my asset 1001 value' });
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.readVoteAsset(ctx, '1003').should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

    describe('#updateVoteAsset', () => {
       

        it('should update a my asset', async () => {
            await contract.updateVoteAsset(ctx,  
              '1003', 
              'nombre votante',
              'creado', 
              '2022-05-11', 
              'andres', 
              'votando',
              '10',
              'electronico',
              'candidateElection',
              'judicialElection',
              );
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"my asset 1001 new value"}'));
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.updateVoteAsset(ctx, 
                '1003', 
                'nombre votante',
                'creado', 
                '2022-05-11', 
                'andres', 
                'votando',
                '10',
                'electronico',
                'candidateElection',
                'judicialElection',).should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

    describe('#deleteVoteAsset', () => {

        it('should delete a my asset', async () => {
            await contract.deleteVoteAsset(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.deleteVoteAsset(ctx, '1003').should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

});
