///////////////////////////////////////////////
//* CREATION D'UN SERVEUR NODE AVEC EXPRESS *//
//////////////////////////////////////////////

const http = require('http');
const app = require('./app');
const helmet = require('helmet');

const portNormalize = valide => {
  const port = parseInt(valide, 10);

  if (isNaN(port)) {
    return valide;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};


const port = portNormalize(process.env.PORT);
app.set('port', port);

const gestionnaireErreur = error => {

  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur avec la methode "createServer" :
const server = http.createServer(app);
// Protection de l'en-tête http : 
app.use(helmet());

server.on('error', gestionnaireErreur);

server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);








