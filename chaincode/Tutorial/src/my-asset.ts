/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Param, Property } from 'fabric-contract-api';
//import './engine';

@Object()
export class MyAsset {

    @Property()
    public value: string;

    @Property()
    public type: string;

    @Property()
    public state: string;

    @Property()
    public owner: string;

    @Property()
    public action: string;

    @Property()
    public engineList: string;

    @Property()
    public associatedDocuments: string;
    
   
    

    
}
