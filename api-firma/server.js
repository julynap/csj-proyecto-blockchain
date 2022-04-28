var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const query = require('./src/query.js');
const createAsset = require('./src/create.js');
const updateAsset = require('./src/update.js');
const util = require('./src/commons/utils.js');
const md5 = require("blueimp-md5");
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


//Punto de acceso GET para consultar el documento por id
app.get('/api/firma/documento/:id', async function (req, res) {
  try {

     console.log(req.params.id);

     let response="";
     //Llama la funcion que consulta el chaincode
     const msj = await query.consulta( req.params.id.toString());
     console.log(msj);
     //Valida que la respuesta no tenga el codigo 400
     if(msj.code!="400"){
        response ={
                    codigo:200,
                    mensaje:"Transacción Exitosa",
                    Data:msj
        }

     }else{
        response=msj;
     }
     console.log(response);
     res.json(response);
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }
})
//Punto de acceso POST para crear el documento
app.post('/api/firma/documento', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('assetId', req.body.assetId,'String',true,1, 20);
      util.validarParametro('description', req.body.description,'String',true,1, 20);
      util.validarParametro('type', req.body.type,'String',true,1, 20);
      util.validarParametro('state', req.body.state,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('action', req.body.action,'String',true,1, 20);
   
      console.log(req.body);
      //funcion que llama el chaincode para crear el documento
      const response = await createAsset.create(req.body);
      res.json(response);
  } catch (error) {
    console.error(`Failed to summit transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

});



//Punto de acceso PUT para actualizar el documento
app.put('/api/firma/documento', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('assetId', req.body.assetId,'String',true,1, 20);
      util.validarParametro('description', req.body.description,'String',true,1, 20);
      util.validarParametro('type', req.body.type,'String',true,1, 20);
      util.validarParametro('state', req.body.state,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('action', req.body.action,'String',true,1, 20);
     
      console.log(req.body);
       //funcion que llama el chaincode para crear el documento
      const response = await updateAsset.update(req.body);
      res.json(response);
  
  } catch (error) {
    console.error(`Failed to update transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

});

//Punto de acceso DELETE para eliminar el documento por id
app.delete('/api/firma/documento/:id', async function (req, res) {
  try {

     console.log(req.params.id);

     let response="";
     //Llama la funcion que consulta el chaincode
     const msj = await query.consulta( req.params.id.toString());
     console.log(`Response : ${msj}`);
     //Valida que la respuesta no tenga el codigo 400
     if(msj.code!="400"){
       //funcion que llama el chaincode para actualizar el documento
       msj.state="Eliminado";
       msj.assetId=req.params.id;
       console.log(`Inicia actualizar el estado a eliminado`);
     
       const response = await updateAsset.update(msj);
       res.json(response);
     }else{
        response=msj;
     }
     res.json(response);
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }
})


app.listen(8088, ()=>{
  console.log("***********************************");
  console.log("API server listening at localhost:8088");
  console.log("***********************************");
});