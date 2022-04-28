/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { DocumentAsset } from './document-asset';

@Info({title: 'DocumentAssetContract', description: 'Document Smart Contract' })
export class DocumentAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async documentAssetExists(ctx: Context, documentAssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(documentAssetId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async createDocumentAsset(ctx: Context, documentAssetId: string, description: string,
        type: string,
        state: string,
        owner: string,
        action: string
        ): Promise<Object> {

        const exists: boolean = await this.documentAssetExists(ctx, documentAssetId);
        if (exists) {
            let msgResponse ={
                codigo: 400,
                mensaje:"El asset " +documentAssetId + " ya existe."
            }
            return msgResponse;
          }
        
        const documentAsset: DocumentAsset = new DocumentAsset();
        documentAsset.description = description;
        documentAsset.type = type;
        documentAsset.state = state;
        documentAsset.owner = owner;
        documentAsset.action = action;
       
        const buffer: Buffer = Buffer.from(JSON.stringify(documentAsset));
        await ctx.stub.putState(documentAssetId, buffer);

        let msgResponse ={
                            codigo: 200,
                            mensaje: "Transacción "+documentAssetId+" creada exitosamente."
        }
        return msgResponse;
    }

    @Transaction(false)
    @Returns('DocumentAsset')
    public async readDocumentAsset(ctx: Context, documentAssetId: string): Promise<Object> {
        const exists: boolean = await this.documentAssetExists(ctx, documentAssetId);
        if (!exists) {
           // throw new Error(`The my asset ${documentAssetId} does not exist`);
           let msgResponse= {
                               code: 400,
                               message: `El asset ${documentAssetId} no existe` 
                            }

            return msgResponse;
        }
        const data: Uint8Array = await ctx.stub.getState(documentAssetId);
        const documentAsset: DocumentAsset = JSON.parse(data.toString()) as DocumentAsset;
        return documentAsset;
    }

    @Transaction()
    public async updateDocumentAsset(ctx: Context, documentAssetId: string, description: string,
            type: string,
            state: string,
            owner: string,
            action: string
            ): Promise<Object> {

        const exists: boolean = await this.documentAssetExists(ctx, documentAssetId);
        if (!exists) {
            //throw new Error(`The my asset ${documentAssetId} does not exist`);
            let msgResponse ={
                codigo: 400,
                mensaje:"El  asset " +documentAssetId + " no existe."
            }
            return msgResponse;
        }
      
        const documentAsset: DocumentAsset = new DocumentAsset();
        documentAsset.description = description;
        documentAsset.type = type;
        documentAsset.state = state;
        documentAsset.owner = owner;
        documentAsset.action = action;
       
        const buffer: Buffer = Buffer.from(JSON.stringify(documentAsset));
        await ctx.stub.putState(documentAssetId, buffer);

        let msgResponse ={
            codigo: 200,
            mensaje: "Transacción "+documentAssetId+" actualizada exitosamente."
        }
        return msgResponse;
    }

    @Transaction()
    public async deleteDocumentAsset(ctx: Context, documentAssetId: string): Promise<Object> {
        const exists: boolean = await this.documentAssetExists(ctx, documentAssetId);
        if (!exists) {
            //throw new Error(`The my asset ${documentAssetId} does not exist`);
            let msgResponse ={
                codigo: 400,
                mensaje:"El asset " +documentAssetId + " no existe."
            }
            return msgResponse;
        }
        await ctx.stub.deleteState(documentAssetId);

        let msgResponse ={
            codigo: 200,
            mensaje: "Transacción "+documentAssetId+" eliminada exitosamente."
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
