import app from './app.js';
import config from './config/index.js';

const port = Number(config.port) || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
