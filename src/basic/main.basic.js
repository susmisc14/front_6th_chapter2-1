import { AppController } from './controllers/AppController.js';

function main() {
  const root = document.getElementById('app');
  const app = new AppController(root);
  app.init();
}

main();


