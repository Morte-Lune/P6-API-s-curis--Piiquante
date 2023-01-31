// CREATION D'UN SERVEUR NODE AVEC EXPRESS //

/* Import du package HTTP natif de Node pour utiliser un protocolecréer un serveur*/
// le mot-clé require permet d'importer le module http
const http = require('http');
// Importe le fichier app.js : 
const app = require('./app');

/* La fonction portNormalize renvoie un port valide, qu'il soit fourni sous la forme d'un nuémro ou d'une chaîne */
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

// Variable d'environnement : 
const port = portNormalize(process.env.PORT || '3000');
app.set('port', port);

/*La fonction gestionnaireErreur, recherche les différentes erreurs et les gère de manière
appropriée. Elle est ensuite enregistrée dans le serveur */
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

server.on('error', gestionnaireErreur);

/* un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé 
sur lequel le serveurs'exécute dans la console */
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);










