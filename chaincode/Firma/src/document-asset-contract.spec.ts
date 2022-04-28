/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { DocumentAssetContract } from '.';

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

describe('DocumentAssetContract', () => {

    let contract: DocumentAssetContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new DocumentAssetContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my asset 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my asset 1002 value"}'));
    });

    describe('#documentAssetExists', () => {

        it('should return true for a my asset', async () => {
            await contract.documentAssetExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a my asset that does not exist', async () => {
            await contract.documentAssetExists(ctx, '1003').should.eventually.be.false;
        });

    });


    describe('#createDocumentAsset', () => {
      
        it('should create a my asset', async () => {
            
            
            await contract.createDocumentAsset(ctx, '1003', 'my asset 1003 value','my type', 'create', 'andres', 'excute');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"my asset 1003 value"}'));
        });

        it('should throw an error for a my asset that already exists', async () => {
            
            await contract.createDocumentAsset(ctx, '1001', 'myvalue','my type', 'create', 'andres', 'excute').should.be.rejectedWith(/The my asset 1001 already exists/);
        });

    });

    describe('#readDocumentAsset', () => {

        it('should return a my asset', async () => {
            await contract.readDocumentAsset(ctx, '1001').should.eventually.deep.equal({ value: 'my asset 1001 value' });
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.readDocumentAsset(ctx, '1003').should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

    describe('#updateDocumentAsset', () => {
        
        it('should update a my asset', async () => {
            await contract.updateDocumentAsset(ctx,  '1003', 'my asset 1003 value','my type', 'create', 'andres', 'excute');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"my asset 1001 new value"}'));
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.updateDocumentAsset(ctx, '1003', 'my asset 1003 value','my type', 'create', 'andres', 'excute').should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

    describe('#deleteDocumentAsset', () => {

        it('should delete a my asset', async () => {
            await contract.deleteDocumentAsset(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.deleteDocumentAsset(ctx, '1003').should.be.rejectedWith(/The my asset 1003 does not exist/);
        });

    });

});
