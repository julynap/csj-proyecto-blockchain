/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Param, Property } from 'fabric-contract-api';
import './engine';
import { engine } from './engine';

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
    public resultadosMotor: any = [];

    /*@Property()
    public resultadosMotor: any = { //new attribute added
        param1: 'param1',
        param2: 'param2'
    }; // Additional params in the future need*/

    @Property()
    public async did(data: string): Promise<string> {
        return "ok";
    }   

    /*@Property()
    public lista: Array<string>;*/


    
   /* @Param("engineList", "Array", "[{'key':'documento','value':'cedula'},{'key':'documento2','value':'tarjeta'}]")
    public engineList: engine[];*/
/*
    @Property()
    public associatedDocuments: Array<string>;
*/
    

    
}
