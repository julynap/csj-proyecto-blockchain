/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Param, Property } from 'fabric-contract-api';
//import './engine';

@Object()
export class DocumentAsset {

    
    @Property()
    public type: string;

    @Property()
    public state: string;

    @Property()
    public owner: string;

    @Property()
    public action: string;

    @Property()
    public description: string;

  
    

    
}
