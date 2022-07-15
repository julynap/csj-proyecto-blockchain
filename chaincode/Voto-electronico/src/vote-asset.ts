/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Param, Property } from 'fabric-contract-api';
//import './engine';

@Object()
export class VoteAsset {

    // nombre de votación
    @Property()
    public nombre: string;

    //estado proceso.
    @Property()
    public estado: string;

    //fecha y hora de actualización.
    @Property()
    public fecha: string;

    //votantes.
    @Property()
    public votantes: string;

    //estado de votante.
    @Property()
    public estadoVotantes: string;

    //numero de ronda.
    @Property()
    public numeroRondas: string;

    //tipo votacion.
    @Property()
    public tipoVotantes: string;

     //Elección de Candidato(s).
     @Property()
     public eleccionCandidatos: string;

    //Elección Judicial(s).
    @Property()
    public eleccionJudicial: string;


    
}
