'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

//Funcion que captura el error de parametros y retorna la excepcion
function ExcepcionError(description, mensaje) {
  this.codigo = 400;
  this.mensaje = mensaje
  this.toString = function() {
     return this.valor + this.mensaje
  };
}

//Funcion encargada de validar parametros
function validarParametro(nombre, val, tipo, obligatorio, minCifrasInt,  cifrasInt, cifrasDec) {
  var mensaje = '';
  if (typeof val == 'undefined' || val == null || val.length == 0) {
      if (obligatorio) mensaje = 'Variable ' + nombre + ' indefinida';
  }
  else {
      var valor = val.toString();
      switch (tipo) {
          case 'String':
              var patternStr = /^[0-9a-zA-ZáéíóúñÁÉÍÚÓÑ#@.,\-_:\s]+$/;
              var validPatternStr = true;
              validPatternStr = validPatternStr && patternStr.test(valor);
              if (!validPatternStr) mensaje = 'Parametro String ' + nombre + ' invalido';
              else if (valor.length < minCifrasInt || valor.length > cifrasInt) { mensaje = 'Longitud de ' + nombre + ' invalida'; }
              break;
          case 'Integer':
              if (isNaN(valor)) mensaje = 'La variable ' + nombre + ' debe ser numerica';
              else if (!Number.isInteger(Number(valor))) mensaje = 'La variable ' + nombre + ' debe ser un valor entero';
              else if (valor.length > cifrasInt) { mensaje = 'Longitud de ' + nombre + ' invalida'; }
              break;
          case 'Float':
              if (isNaN(valor)) mensaje = 'La variable ' + nombre + ' debe ser numerica';
              var vecDecimales = valor.split('.');
              if (vecDecimales[0]) {
                  if (vecDecimales[0].length > cifrasInt) { mensaje = 'Cifra entera de ' + nombre + ' invalida'; }
              }
              if (vecDecimales[1]) {
                  if (vecDecimales[1].length > cifrasDec) { mensaje = 'Cifra decimal de ' + nombre + ' invalida'; }
              }
              break;
          case 'Date':
              var datePattern = /^((2[0-9]|19)[0-9]{2})-(1[0-2]|0[1-9])-(0[1-9]|[12][0-9]|3[01])$/;
              var validDates = true;
              validDates = validDates && datePattern.test(valor);
              if (!validDates) mensaje = 'Formato de fecha para ' + nombre + ' invalido, formato valido AAAA-MM-DD';
              break;
          case 'Email':
              var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              var validEmails = true;
              validEmails = validEmails && emailPattern.test(valor);
              if (!validEmails) mensaje = 'Formato de email para ' + nombre + ' invalido';
              break;
          case 'Boolean':
              if (typeof val !== "boolean") mensaje = 'La variable ' + nombre + ' debe tener un valor booleano (true, false)';
              break;
          case 'Array':
                
                break;
      }
       if (nombre == 'idType') {
      var idTypeIsValid = validateidType(val.toString());
      if (!idTypeIsValid) {
          mensaje = 'El valor del campo ' + nombre + ' no es válido';
      }
  }
}
if (mensaje != '') {
    throw new ExcepcionError('ParametersException', mensaje)
  return false;
}
else return true;
}
module.exports = {validarParametro}

