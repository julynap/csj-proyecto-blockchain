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
        msj.associatedDocuments= JSON.parse(msj.associatedDocuments);
        msj.engineList=JSON.parse(msj.engineList);
        response ={
                    codigo:200,
                    mensaje:"Transacción Exitosa",
                    Data:msj
        }

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
//Punto de acceso POST para crear el Proceso
app.post('/api/reparto/proceso', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('assetId', req.body.assetId,'String',true,1, 20);
      util.validarParametro('code', req.body.code,'String',true,1, 20);
      util.validarParametro('type', req.body.type,'String',true,1, 20);
      util.validarParametro('state', req.body.state,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('action', req.body.action,'String',true,1, 20);
      util.validarParametro('engineList', req.body.engineList,'Array',true,1, 20);
      util.validarParametro('associatedDocuments', req.body.associatedDocuments,'Array',true,1, 20);
    
      //Transforma en hash los documentos que vienen en Base64
      let documentHash=[];
      req.body.associatedDocuments.forEach(element => {
          documentHash.push(md5(element));
      });
      req.body.associatedDocuments=documentHash;
      
      console.log(req.body);
      //convierte en string los arreglos, ya que el chaincode no soporte envio de arreglos
      req.body.engineList= JSON.stringify(req.body.engineList);
      req.body.associatedDocuments= JSON.stringify(req.body.associatedDocuments);
      //funcion que llama el chaincode para crear el proceso
      const response = await createAsset.create(req.body);
      res.json(response);
  } catch (error) {
    console.error(`Failed to summit transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

});



//Punto de acceso PUT para actualizar el Proceso
app.put('/api/reparto/proceso', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('assetId', req.body.assetId,'String',true,1, 20);
      util.validarParametro('code', req.body.code,'String',true,1, 20);
      util.validarParametro('type', req.body.type,'String',true,1, 20);
      util.validarParametro('state', req.body.state,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('action', req.body.action,'String',true,1, 20);
      util.validarParametro('engineList', req.body.engineList,'Array',true,1, 20);
      util.validarParametro('associatedDocuments', req.body.associatedDocuments,'Array',true,1, 20);

      console.log(req.body);
      //convierte en json  los arreglos que estan en string, ya que el chaincode no soporte los arreglos
      req.body.engineList= JSON.stringify(req.body.engineList);
      req.body.associatedDocuments= JSON.stringify(req.body.associatedDocuments);
      //funcion que llama el chaincode para crear el proceso
      const response = await updateAsset.update(req.body);
      res.json(response);
  
  } catch (error) {
    console.error(`Failed to update transaction: ${error}`);
    res.status(500).json({
      error: error
    });
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
    res.status(500).json({
      error: error
    });
  }
})


app.listen(8089, ()=>{
  console.log("***********************************");
  console.log("API server listening at localhost:8089");
  console.log("***********************************");
});