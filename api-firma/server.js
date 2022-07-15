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

//codigo para cargar el swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Punto de acceso GET para consultar el documento por id
app.get('/api/firma/:id', async function (req, res) {
  try {

     console.log(req.params.id);

     let response="";
     //Llama la funcion que consulta el chaincode
     const msj = await query.consulta( req.params.id.toString());
     console.log(msj);
     //Valida que la respuesta no tenga el codigo 400
     if(msj.code!="400"){
        msj.estaticos= JSON.parse(msj.estaticos);
        msj.dinamicos=JSON.parse(msj.dinamicos);
        response ={
                    codigo:200,
                    mensaje:"Transacción Exitosa",
                    contenido:msj
        }

     }else{
        response=msj;
     }
     console.log(response);
     res.json(response);
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json(
      error
   );
  }
})
//Punto de acceso POST para crear el documento
app.post('/api/firma', async function (req, res) {

  try {

     //Validar estructura de entrada del api
      util.validarParametro('id', req.body.id,'String',true,1, 20);
      util.validarParametro('estado', req.body.estado,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('procesoDinamico', req.body.procesoDinamico,'String',true,1, 20);
      util.validarParametro('documentoOriginal', req.body.documentoOriginal,'String',true,1, 20);
      util.validarParametro('plazo', req.body.plazo,'String',true,1, 20);
      util.validarParametro('estaticos', req.body.estaticos,'Array',true,1, 20);
      util.validarParametro('dinamicos', req.body.dinamicos,'Array',true,1, 20);
      util.validarParametro('firmaUsuario', req.body.firmaUsuario,'String',true,1, 50);
      util.validarParametro('fechaHoraFirma', req.body.fechaHoraFirma,'String',true,1, 50);
   
      console.log(req.body);
      //convierte en string los arreglos, ya que el chaincode no soporte envio de arreglos
      req.body.estaticos= JSON.stringify(req.body.estaticos);
      req.body.dinamicos= JSON.stringify(req.body.dinamicos);
      //funcion que llama el chaincode para crear el documento
      const response = await createAsset.create(req.body);
      res.json(response);
  } catch (error) {
    console.error(`Failed to summit transaction: ${error}`);
    res.status(500).json(
      error
   );
  }

});



//Punto de acceso PUT para actualizar el documento
app.put('/api/firma', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('id', req.body.id,'String',true,1, 20);
      util.validarParametro('estado', req.body.estado,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('procesoDinamico', req.body.procesoDinamico,'String',true,1, 20);
      util.validarParametro('documentoOriginal', req.body.documentoOriginal,'String',true,1, 20);
      util.validarParametro('plazo', req.body.plazo,'String',true,1, 20);
      util.validarParametro('estaticos', req.body.estaticos,'Array',true,1, 20);
      util.validarParametro('dinamicos', req.body.dinamicos,'Array',true,1, 20);
      util.validarParametro('firmaUsuario', req.body.firmaUsuario,'String',true,1, 50);
      util.validarParametro('fechaHoraFirma', req.body.fechaHoraFirma,'String',true,1, 50);
     
      console.log(req.body);
      //convierte en string los arreglos, ya que el chaincode no soporte envio de arreglos
      req.body.estaticos= JSON.stringify(req.body.estaticos);
      req.body.dinamicos= JSON.stringify(req.body.dinamicos);
       //funcion que llama el chaincode para crear el documento
      const response = await updateAsset.update(req.body);
      res.json(response);
  
  } catch (error) {
    console.error(`Failed to update transaction: ${error}`);
    res.status(500).json(
      error
   );
  }

});

//Punto de acceso DELETE para eliminar el documento por id
app.delete('/api/firma/:id', async function (req, res) {
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
    res.status(500).json(
      error
   );
  }
})


app.listen(8088, ()=>{
  console.log("***********************************");
  console.log("API server listening at localhost:8088");
  console.log("***********************************");
});