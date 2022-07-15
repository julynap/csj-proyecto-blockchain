/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { VoteAsset } from './vote-asset';

@Info({title: 'VoteAssetContract', description: 'Vote Smart Contract' })
export class VoteAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async voteAssetExists(ctx: Context, voteAssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(voteAssetId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async createVoteAsset(ctx: Context, voteAssetId: string, name: string,
        state: string,
        date: string,
        voters: string,
        voterStatus: string,
        roundNumber: string,
        votingType: string,
        candidateElection: string,
        judicialElection: string
        ): Promise<Object> {


        const exists: boolean = await this.voteAssetExists(ctx, voteAssetId);
        if (exists) {
            let msgResponse ={
                codigo: 400,
                mensaje:"El asset " +voteAssetId + " ya existe."
            }
            return msgResponse;
          }
        
        const voteAsset: VoteAsset = new VoteAsset();
        voteAsset.nombre = name;
        voteAsset.estado = state;
        voteAsset.fecha = date;
        voteAsset.votantes = voters;
        voteAsset.estadoVotantes = voterStatus;
        voteAsset.numeroRondas = roundNumber;
        voteAsset.tipoVotantes = votingType;
        voteAsset.eleccionCandidatos = candidateElection;
        voteAsset.eleccionJudicial = judicialElection;
       
       
        const buffer: Buffer = Buffer.from(JSON.stringify(voteAsset));
        await ctx.stub.putState(voteAssetId, buffer);

        let msgResponse ={
                            codigo: 200,
                            mensaje: "Transacción "+voteAssetId+" creada exitosamente."
        }
        return msgResponse;
    }

    @Transaction(false)
    @Returns('VoteAsset')
    public async readVoteAsset(ctx: Context, voteAssetId: string): Promise<Object> {
        const exists: boolean = await this.voteAssetExists(ctx, voteAssetId);
        if (!exists) {
           let msgResponse= {
                               code: 400,
                               message: `El asset ${voteAssetId} no existe` 
                            }

            return msgResponse;
        }
        const data: Uint8Array = await ctx.stub.getState(voteAssetId);
        const voteAsset: VoteAsset = JSON.parse(data.toString()) as VoteAsset;
        return voteAsset;
    }

    @Transaction()
    public async updateVoteAsset(ctx: Context, voteAssetId: string, name: string,
        state: string,
        date: string,
        voters: string,
        voterStatus: string,
        roundNumber: string,
        votingType: string,
        candidateElection: string,
        judicialElection: string
            ): Promise<Object> {

        const exists: boolean = await this.voteAssetExists(ctx, voteAssetId);
        if (!exists) {
            let msgResponse ={
                codigo: 400,
                mensaje:"El  asset " +voteAssetId + " no existe."
            }
            return msgResponse;
        }
      
        const voteAsset: VoteAsset = new VoteAsset();
        voteAsset.nombre = name;
        voteAsset.estado = state;
        voteAsset.fecha = date;
        voteAsset.votantes = voters;
        voteAsset.estadoVotantes = voterStatus;
        voteAsset.numeroRondas = roundNumber;
        voteAsset.tipoVotantes = votingType;
        voteAsset.eleccionCandidatos = candidateElection;
        voteAsset.eleccionJudicial = judicialElection;
       
       
        const buffer: Buffer = Buffer.from(JSON.stringify(voteAsset));
        await ctx.stub.putState(voteAssetId, buffer);

        let msgResponse ={
            codigo: 200,
            mensaje: "Transacción "+voteAssetId+" actualizada exitosamente."
        }
        return msgResponse;
    }

    @Transaction()
    public async deleteVoteAsset(ctx: Context, voteAssetId: string): Promise<Object> {
        const exists: boolean = await this.voteAssetExists(ctx, voteAssetId);
        if (!exists) {
            let msgResponse ={
                codigo: 400,
                mensaje:"El asset " +voteAssetId + " no existe."
            }
            return msgResponse;
        }
        await ctx.stub.deleteState(voteAssetId);

        let msgResponse ={
            codigo: 200,
            mensaje: "Transacción "+voteAssetId+" eliminada exitosamente."
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
