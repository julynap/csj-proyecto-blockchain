/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Param, Property } from 'fabric-contract-api';
//import './engine';

@Object()
export class ProcessAsset {

    
    @Property()
    public processAssetId: string;

    @Property()
    public tipo: string;

    @Property()
    public estado: string;

    @Property()
    public owner: string;

    @Property()
    public codigo: string;

    @Property()
    public accion: string;

    @Property()
    public juridiccion: string;

    @Property()
    public despacho: string;

    @Property()
    public demandante: string;

    
    @Property()
    public demandado: string;

    @Property()
    public firmantes: string;

    @Property()
    public resultadosMotor: string;

    @Property()
    public documentosAsociados: string;
   
    
}
