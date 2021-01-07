// Módulos
const express = require ('express')
const handlebars = require('express-handlebars')
const bodyParser = require ("body-parser")
const http = require('http')
const { stringify } = require('querystring')
var querystring = require('querystring')
//var Connection = require('tedious').Connection;
const app = express ()

//Config

    //DB
    var config = {
        server: 'virtual2.febracorp.org.br',
        options: {
          database: "CONTOSO"
        },
        authentication: {
          type: 'default',
          options: {
            userName: 'user_trial',
            password: '7412LIVE!@#$%¨&*()'
          }
        }
      }

      /*var connection = new Connection(config);

      connection.on('connect', function(err) {
        if(err) {
          console.log('Error: ', err)
        }
        // If no error, then good to go...
        executeStatement();
      });*/

    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    
    //Body-Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    
    //Rotas
        //HomeForm
        app.get("/", (req, res) => {
            res.render('formulario')
        })
        //Post Json
        app.post('/envio', (req, res) =>{
            var nome = req.body.nome
            var sobrenome = req.body.sobrenome
            var email = req.body.email

            const postData = querystring.stringify({
                "nome": nome,
                "sobrenome": sobrenome,
                "email": email
              });
              
              const options = {
                hostname: '138.68.29.250',
                port: 8082,
                path: '/',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(postData)
                }
              };
              
              const post_req = http.request(options, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                var data = '';
                res.on('data', (chunk) => {
                    const code = chunk
                    const nomeReg = 'n#(\\d*)#';
                    const sobrenomeReg = 's#(\\d*)#';
                    const emailReg = 'e#(\\d.*)#';
                    const n_code = code.match(nomeReg)[1];
                    const s_code = code.match(sobrenomeReg)[1];
                    const e_code = code.match(emailReg)[1];
                    console.log(`BODY: ${chunk}`);
                });
                res.on('end', () => {
                  console.log('No more data in response.');
                });
              });
              
              req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
              });
              
              
              post_req.write(postData);
              post_req.end();

                res.send('Dados coletados : Nome :' + nome + ' Sobrenome: ' + sobrenome + ' E-mail: ' + email)
            })

        

        //Server 
        const PORT = 8081
        app.listen(PORT, () =>{
            console.log("Online")
        })