import { Context, Contract } from 'fabric-contract-api';
export declare class MyAssetContract extends Contract {
    myAssetExists(ctx: Context, myAssetId: string): Promise<boolean>;
    createMyAsset(ctx: Context, myAssetId: string, value: string, type: string, state: string, owner: string, action: string): Promise<Object>;
    readMyAsset(ctx: Context, myAssetId: string): Promise<Object>;
    updateMyAsset(ctx: Context, myAssetId: string, newValue: string): Promise<object>;
    deleteMyAsset(ctx: Context, myAssetId: string): Promise<Object>;
    queryAllAssets(ctx: Context): Promise<string>;
}
