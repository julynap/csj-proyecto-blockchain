var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const query = require('./src/query.js');
const createAsset = require('./src/create.js');
const updateAsset = require('./src/update.js');
const util = require('./src/commons/utils.js');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/api/reparto/proceso/:id', async function (req, res) {
  try {
     console.log(req.params.id);

     let response="";
     const msj = await query.consulta( req.params.id.toString());
     console.error(`Response : ${msj}`);

     
     if(msj.code!="500"){
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

app.post('/api/reparto/proceso', async function (req, res) {

  try {

      util.validarParametro('assetId', req.body.assetId,'String',true,1, 20);
      util.validarParametro('value', req.body.value,'String',true,1, 20);
      util.validarParametro('type', req.body.type,'String',true,1, 20);
      util.validarParametro('state', req.body.state,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('action', req.body.action,'String',true,1, 20);
      util.validarParametro('engineList', req.body.engineList,'Array',true,1, 20);
      util.validarParametro('associatedDocuments', req.body.associatedDocuments,'Array',true,1, 20);

      console.log(req.body);
      req.body.engineList= JSON.stringify(req.body.engineList);
      req.body.associatedDocuments= JSON.stringify(req.body.associatedDocuments);

      const response = await createAsset.create(req.body);
      res.json(response);
  
  } catch (error) {
    console.error(`Failed to summit transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

});




app.put('/api/reparto/proceso', async function (req, res) {

  try {

      util.validarParametro('assetId', req.body.assetId,'String',true,1, 20);
      util.validarParametro('value', req.body.value,'String',true,1, 20);
      util.validarParametro('type', req.body.type,'String',true,1, 20);
      util.validarParametro('state', req.body.state,'String',true,1, 20);
      util.validarParametro('owner', req.body.owner,'String',true,1, 20);
      util.validarParametro('action', req.body.action,'String',true,1, 20);
      util.validarParametro('engineList', req.body.engineList,'Array',true,1, 20);
      util.validarParametro('associatedDocuments', req.body.associatedDocuments,'Array',true,1, 20);

      console.log(req.body);
      req.body.engineList= JSON.stringify(req.body.engineList);
      req.body.associatedDocuments= JSON.stringify(req.body.associatedDocuments);

      const response = await updateAsset.update(req.body);
      res.json(response);
  
  } catch (error) {
    console.error(`Failed to update transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

});




app.listen(8089, ()=>{
  console.log("***********************************");
  console.log("API server listening at localhost:8089");
  console.log("***********************************");
});