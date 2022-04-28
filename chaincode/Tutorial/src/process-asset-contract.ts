/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ProcessAsset } from './process-asset';

@Info({title: 'ProcessAssetContract', description: 'Process Smart Contract' })
export class ProcessAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async processAssetExists(ctx: Context, processAssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(processAssetId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async createProcessAsset(ctx: Context, processAssetId: string, code: string,
        type: string,
        state: string,
        owner: string,
        action: string,
        engineList: string,
        associatedDocuments: string
        ): Promise<Object> {

        const exists: boolean = await this.processAssetExists(ctx, processAssetId);
        if (exists) {
            let msgResponse ={
                codigo: 400,
                mensaje:"El asset " +processAssetId + " ya existe."
            }
            return msgResponse;
          }
        
        const processAsset: ProcessAsset = new ProcessAsset();
        processAsset.code = code;
        processAsset.type = type;
        processAsset.state = state;
        processAsset.owner = owner;
        processAsset.action = action;
        processAsset.engineList = engineList;
        processAsset.associatedDocuments = associatedDocuments;
       
        const buffer: Buffer = Buffer.from(JSON.stringify(processAsset));
        await ctx.stub.putState(processAssetId, buffer);

        let msgResponse ={
                            codigo: 200,
                            mensaje: "Transacción "+processAssetId+" creada exitosamente."
        }
        return msgResponse;
    }

    @Transaction(false)
    @Returns('ProcessAsset')
    public async readProcessAsset(ctx: Context, processAssetId: string): Promise<Object> {
        const exists: boolean = await this.processAssetExists(ctx, processAssetId);
        if (!exists) {
           // throw new Error(`The my asset ${processAssetId} does not exist`);
           let msgResponse= {
                               code: 400,
                               message: `El asset ${processAssetId} no existe` 
                            }

            return msgResponse;
        }
        const data: Uint8Array = await ctx.stub.getState(processAssetId);
        const processAsset: ProcessAsset = JSON.parse(data.toString()) as ProcessAsset;
        return processAsset;
    }

    @Transaction()
    public async updateProcessAsset(ctx: Context, processAssetId: string, code: string,
            type: string,
            state: string,
            owner: string,
            action: string,
            engineList: string,
            associatedDocuments: string
            ): Promise<Object> {

        const exists: boolean = await this.processAssetExists(ctx, processAssetId);
        if (!exists) {
            //throw new Error(`The my asset ${processAssetId} does not exist`);
            let msgResponse ={
                codigo: 400,
                mensaje:"El  asset " +processAssetId + " no existe."
            }
            return msgResponse;
        }
      
        const processAsset: ProcessAsset = new ProcessAsset();
        processAsset.code = code;
        processAsset.type = type;
        processAsset.state = state;
        processAsset.owner = owner;
        processAsset.action = action;
        processAsset.engineList = engineList;
        processAsset.associatedDocuments = associatedDocuments;
       
        const buffer: Buffer = Buffer.from(JSON.stringify(processAsset));
        await ctx.stub.putState(processAssetId, buffer);

        let msgResponse ={
            codigo: 200,
            mensaje: "Transacción "+processAssetId+" actualizada exitosamente."
        }
        return msgResponse;
    }

    @Transaction()
    public async deleteProcessAsset(ctx: Context, processAssetId: string): Promise<Object> {
        const exists: boolean = await this.processAssetExists(ctx, processAssetId);
        if (!exists) {
            //throw new Error(`The my asset ${processAssetId} does not exist`);
            let msgResponse ={
                codigo: 400,
                mensaje:"El asset " +processAssetId + " no existe."
            }
            return msgResponse;
        }
        await ctx.stub.deleteState(processAssetId);

        let msgResponse ={
            codigo: 200,
            mensaje: "Transacción "+processAssetId+" eliminada exitosamente."
        }
        return msgResponse;
    }

    @Transaction(false)
    public async queryAllAssets(ctx: Context): Promise<string> {
        const startKey = '000';
        const endKey = '999';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString());
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

}
