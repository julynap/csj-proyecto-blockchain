/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { MyAsset } from './my-asset';


@Info({title: 'MyAssetContract', description: 'My Smart Contract' })
export class MyAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async myAssetExists(ctx: Context, myAssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(myAssetId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async createMyAsset(ctx: Context, myAssetId: string, value: string,
        type: string,
        state: string,
        owner: string,
        action: string,
        engineList: string,
        associatedDocuments: string
        ): Promise<Object> {

        const exists: boolean = await this.myAssetExists(ctx, myAssetId);
        if (exists) {
            let msgResponse ={
                codigo: 500,
                mensaje:"El asset " +myAssetId + " ya existe."
            }
            return msgResponse;
          }
        
        const myAsset: MyAsset = new MyAsset();
        myAsset.value = value;
        myAsset.type = type;
        myAsset.state = state;
        myAsset.owner = owner;
        myAsset.action = action;
        myAsset.engineList = engineList;
        myAsset.associatedDocuments = associatedDocuments;
       
        const buffer: Buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(myAssetId, buffer);

        let msgResponse ={
                            codigo: 200,
                            mensaje: "Transacción "+myAssetId+" creada exitosamente."
        }
        return msgResponse;
    }

    @Transaction(false)
    @Returns('MyAsset')
    public async readMyAsset(ctx: Context, myAssetId: string): Promise<Object> {
        const exists: boolean = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
           // throw new Error(`The my asset ${myAssetId} does not exist`);
           let msgResponse= {
                               code: 500,
                               message: `El asset ${myAssetId} no existe` 
                            }

            return msgResponse;
        }
        const data: Uint8Array = await ctx.stub.getState(myAssetId);
        const myAsset: MyAsset = JSON.parse(data.toString()) as MyAsset;
        return myAsset;
    }

    @Transaction()
    public async updateMyAsset(ctx: Context, myAssetId: string, newValue: string): Promise<object> {
        const exists: boolean = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            //throw new Error(`The my asset ${myAssetId} does not exist`);
            let msgResponse ={
                codigo: 500,
                mensaje:"El  asset " +myAssetId + " no existe."
            }
            return msgResponse;
        }
        const myAsset: MyAsset = new MyAsset();
        myAsset.value = newValue;
        const buffer: Buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(myAssetId, buffer);

        let msgResponse ={
            codigo: 200,
            mensaje: "Transacción "+myAssetId+" actualizada exitosamente."
        }
        return msgResponse;
    }

    @Transaction()
    public async deleteMyAsset(ctx: Context, myAssetId: string): Promise<Object> {
        const exists: boolean = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            //throw new Error(`The my asset ${myAssetId} does not exist`);
            let msgResponse ={
                codigo: 500,
                mensaje:"El asset " +myAssetId + " no existe."
            }
            return msgResponse;
        }
        await ctx.stub.deleteState(myAssetId);

        let msgResponse ={
            codigo: 200,
            mensaje: "Transacción "+myAssetId+" eliminada exitosamente."
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
