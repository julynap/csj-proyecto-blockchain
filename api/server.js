var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const query = require('./src/query.js')
const createAsset = require('./src/create.js')
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/api/reparto/proceso/:id', async function (req, res) {
  try {
     console.log(req.params.id);
     const response = await query.consulta( req.params.id.toString());

     response.associatedDocuments= JSON.parse(response.associatedDocuments);
     response.engineList=JSON.parse(response.engineList);

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
    let error="";
    if(!req.body.assetId)
    error="El atributo assetId no esta declarado."
    if(!req.body.value)
    error="El atributo value no esta declarado."
    if(!req.body.type)
    error="El atributo type no esta declarado."
    if(!req.body.state)
    error="El atributo state no esta declarado."
    if(!req.body.owner)
    error="El atributo owner no esta declarado."
    if(!req.body.action)
    error="El atributo action no esta declarado."
    if(!req.body.engineList)
    error="El atributo engineList no esta declarado."
    if(!req.body.associatedDocuments)
    error="El atributo associatedDocuments no esta declarado."

   
   if(error==""){

      console.log(req.body);
      req.body.engineList= JSON.stringify(req.body.engineList);
      req.body.associatedDocuments= JSON.stringify(req.body.associatedDocuments);

      const response = await createAsset.create(req.body);
      res.json(response);
   }else{
        let msgResponse= {
          code: 500,
          message: error 
      }
      res.json(msgResponse);
     return msgResponse;
   }
   

  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

});


app.listen(8089, ()=>{
  console.log("***********************************");
  console.log("API server listening at localhost:8080");
  console.log("***********************************");
});