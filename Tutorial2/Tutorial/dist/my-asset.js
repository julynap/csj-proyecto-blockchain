"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAsset = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
require("./engine");
let MyAsset = class MyAsset {
    constructor() {
        this.resultadosMotor = [];
        /*@Property()
        public lista: Array<string>;*/
        /* @Param("engineList", "Array", "[{'key':'documento','value':'cedula'},{'key':'documento2','value':'tarjeta'}]")
         public engineList: engine[];*/
        /*
            @Property()
            public associatedDocuments: Array<string>;
        */
    }
    /*@Property()
    public resultadosMotor: any = { //new attribute added
        param1: 'param1',
        param2: 'param2'
    }; // Additional params in the future need*/
    async did(data) {
        return "ok";
    }
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], MyAsset.prototype, "value", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], MyAsset.prototype, "type", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], MyAsset.prototype, "state", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], MyAsset.prototype, "owner", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], MyAsset.prototype, "action", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Object)
], MyAsset.prototype, "resultadosMotor", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MyAsset.prototype, "did", null);
MyAsset = __decorate([
    fabric_contract_api_1.Object()
], MyAsset);
exports.MyAsset = MyAsset;
//# sourceMappingURL=my-asset.js.map