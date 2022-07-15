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


//Punto de acceso GET para consultar el proceso por id
app.get('/api/reparto/proceso/:id', async function (req, res) {
  try {

     console.log(req.params.id);

     let response="";
     //Llama la funcion que consulta el chaincode
     const msj = await query.consulta( req.params.id.toString());
     console.log(msj);
     //Valida que la respuesta no tenga el codigo 400
     if(msj.code!="400"){
        msj.documentosAsociados= JSON.parse(msj.documentosAsociados);
        msj.firmantes=JSON.parse(msj.firmantes);
        msj.resultadosMotor=JSON.parse(msj.resultadosMotor);
        response ={
                    codigo:200,
                    mensaje:"Transacción Exitosa",
                    contenido:msj
        }

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
//Punto de acceso POST para crear el Proceso
app.post('/api/reparto/proceso', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('id', req.body.id,'String',true,1, 20);
      util.validarParametro('tipo', req.body.tipo,'String',true,1, 20);
      util.validarParametro('estado', req.body.estado,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('codigo', req.body.codigo,'String',true,1, 20);
      util.validarParametro('accion', req.body.accion,'String',true,1, 20);
      util.validarParametro('juridiccion', req.body.juridiccion,'String',true,1, 20);
      util.validarParametro('despacho', req.body.despacho,'String',true,1, 20);
      util.validarParametro('demandante', req.body.demandante,'String',true,1, 20);
      util.validarParametro('demandado', req.body.demandado,'String',true,1, 20);
      util.validarParametro('firmantes', req.body.firmantes,'Array',true,1, 20);
      util.validarParametro('resultadosMotor', req.body.resultadosMotor,'Array',true,1, 20);
      util.validarParametro('documentosAsociados', req.body.documentosAsociados,'Array',true,1, 20);
     
      //Transforma en hash los documentos que vienen en Base64
      let documentHash=[];
      req.body.documentosAsociados.forEach(element => {
          documentHash.push(md5(element));
      });
      req.body.documentosAsociados=documentHash;
      
      console.log(req.body);
      //convierte en string los arreglos, ya que el chaincode no soporte envio de arreglos
      req.body.firmantes= JSON.stringify(req.body.firmantes);
      req.body.resultadosMotor= JSON.stringify(req.body.resultadosMotor);
      req.body.documentosAsociados= JSON.stringify(req.body.documentosAsociados);
      //funcion que llama el chaincode para crear el proceso
      const response = await createAsset.create(req.body);
      res.json(response);
  } catch (error) {
    console.error(`Failed to summit transaction: ${error}`);
    res.status(500).json(
      error
   );
  }

});



//Punto de acceso PUT para actualizar el Proceso
app.put('/api/reparto/proceso', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('id', req.body.id,'String',true,1, 20);
      util.validarParametro('tipo', req.body.tipo,'String',true,1, 20);
      util.validarParametro('estado', req.body.estado,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('codigo', req.body.codigo,'String',true,1, 20);
      util.validarParametro('accion', req.body.accion,'String',true,1, 20);
      util.validarParametro('juridiccion', req.body.juridiccion,'String',true,1, 20);
      util.validarParametro('despacho', req.body.despacho,'String',true,1, 20);
      util.validarParametro('demandante', req.body.demandante,'String',true,1, 20);
      util.validarParametro('demandado', req.body.demandado,'String',true,1, 20);
      util.validarParametro('firmantes', req.body.firmantes,'Array',true,1, 20);
      util.validarParametro('resultadosMotor', req.body.resultadosMotor,'Array',true,1, 20);
      util.validarParametro('documentosAsociados', req.body.documentosAsociados,'Array',true,1, 20);

      console.log(req.body);
      //convierte en json  los arreglos que estan en string, ya que el chaincode no soporte los arreglos
      req.body.firmantes= JSON.stringify(req.body.firmantes);
      req.body.resultadosMotor= JSON.stringify(req.body.resultadosMotor);
      req.body.documentosAsociados= JSON.stringify(req.body.documentosAsociados);
      //funcion que llama el chaincode para crear el proceso
      const response = await updateAsset.update(req.body);
      res.json(response);
  
  } catch (error) {
    console.error(`Failed to update transaction: ${error}`);
    res.status(500).json(
       error
    );
  }

});

//Punto de acceso DELETE para eliminar el proceso por id
app.delete('/api/reparto/proceso/:id', async function (req, res) {
  try {

     console.log(req.params.id);

     let response="";
     //Llama la funcion que consulta el chaincode
     const msj = await query.consulta( req.params.id.toString());
     console.log(`Response : ${msj}`);
     //Valida que la respuesta no tenga el codigo 400
     if(msj.code!="400"){
       //funcion que llama el chaincode para actualizar el proceso
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


app.listen(8089, ()=>{
  console.log("***********************************");
  console.log("API server listening at localhost:8089");
  console.log("***********************************");
});