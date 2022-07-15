/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Param, Property } from 'fabric-contract-api';
//import './engine';

@Object()
export class DocumentAsset {

    
    @Property()
    public id: string;

    @Property()
    public estado: string;

    @Property()
    public owner: string;

    @Property()
    public procesoDinamico: string;

    @Property()
    public documentoOriginal: string;

    @Property()
    public plazo: string;

    @Property()
    public estaticos: string;

    @Property()
    public dinamicos: string;

    @Property()
    public firmaUsuario: string;

    @Property()
    public fechaHoraFirma: string;
  


    
}
