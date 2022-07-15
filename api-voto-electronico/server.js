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


//Punto de acceso GET para consultar el voto electronico por id
app.get('/api/voto-electronico/:id', async function (req, res) {
  try {

     console.log(req.params.id);

     let response="";
     //Llama la funcion que consulta el chaincode
     const msj = await query.consulta( req.params.id.toString());
     console.log(msj);
     //Valida que la respuesta no tenga el codigo 400
     if(msj.code!="400"){
        msj.eleccionCandidatos= JSON.parse(msj.eleccionCandidatos);
        msj.eleccionJudicial=JSON.parse(msj.eleccionJudicial);
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
//Punto de acceso POST para crear el voto electronico
app.post('/api/voto-electronico', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('id', req.body.id,'String',true,1, 20);
      util.validarParametro('nombre', req.body.nombre,'String',true,1, 200);
      util.validarParametro('estado', req.body.estado,'String',true,1, 20);
      util.validarParametro('fecha', req.body.fecha,'String',true,1, 20);
      util.validarParametro('votantes', req.body.votantes,'String',true,1, 20);
      util.validarParametro('estadoVotantes', req.body.estadoVotantes,'String',true,1, 20);
      util.validarParametro('numeroRondas', req.body.numeroRondas,'String',true,1, 20);
      util.validarParametro('tipoVotantes', req.body.tipoVotantes,'String',true,1, 50);
      util.validarParametro('eleccionCandidatos', req.body.eleccionCandidatos,'Array',true,1, 20);
      util.validarParametro('eleccionJudicial', req.body.eleccionJudicial,'Array',true,1, 20);
    
     
      console.log(req.body);
      //convierte en string los arreglos, ya que el chaincode no soporte envio de arreglos
      req.body.eleccionCandidatos= JSON.stringify(req.body.eleccionCandidatos);
      req.body.eleccionJudicial= JSON.stringify(req.body.eleccionJudicial);
      console.log(req.body);
      //funcion que llama el chaincode para crear el voto electronico
      const response = await createAsset.create(req.body);
      console.log(response);
      res.json(response);
  } catch (error) {
    console.error(`Failed to summit transaction: ${error}`);
    res.status(500).json(
      error
   );
  }

});



//Punto de acceso PUT para actualizar el voto electronico
app.put('/api/voto-electronico', async function (req, res) {

  try {
      //Validar estructura de entrada del api
      util.validarParametro('id', req.body.id,'String',true,1, 20);
      util.validarParametro('nombre', req.body.nombre,'String',true,1, 200);
      util.validarParametro('estado', req.body.estado,'String',true,1, 20);
      util.validarParametro('fecha', req.body.fecha,'String',true,1, 20);
      util.validarParametro('votantes', req.body.votantes,'String',true,1, 20);
      util.validarParametro('estadoVotantes', req.body.estadoVotantes,'String',true,1, 20);
      util.validarParametro('numeroRondas', req.body.numeroRondas,'String',true,1, 20);
      util.validarParametro('tipoVotantes', req.body.tipoVotantes,'String',true,1, 50);
      util.validarParametro('eleccionCandidatos', req.body.eleccionCandidatos,'Array',true,1, 20);
      util.validarParametro('eleccionJudicial', req.body.eleccionJudicial,'Array',true,1, 20);
    
     
    
      console.log(req.body);
      //convierte en string los arreglos, ya que el chaincode no soporte envio de arreglos
      req.body.eleccionCandidatos= JSON.stringify(req.body.eleccionCandidatos);
      req.body.eleccionJudicial= JSON.stringify(req.body.eleccionJudicial);
      //funcion que llama el chaincode para crear el voto electronico
      const response = await updateAsset.update(req.body);
      res.json(response);
  
  } catch (error) {
    console.error(`Failed to update transaction: ${error}`);
    res.status(500).json(
       error
    );
  }

});

//Punto de acceso DELETE para eliminar el voto electronico por id
app.delete('/api/voto-electronico/:id', async function (req, res) {
  try {

     console.log(req.params.id);

     let response="";
     //Llama la funcion que consulta el chaincode
     const msj = await query.consulta( req.params.id.toString());
     console.log(`Response : ${msj}`);
     //Valida que la respuesta no tenga el codigo 400
     if(msj.code!="400"){
       //funcion que llama el chaincode para actualizar el voto electronico
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