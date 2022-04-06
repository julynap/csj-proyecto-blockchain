import './engine';
export declare class MyAsset {
    value: string;
    type: string;
    state: string;
    owner: string;
    action: string;
    resultadosMotor: any;
    did(data: string): Promise<string>;
}
