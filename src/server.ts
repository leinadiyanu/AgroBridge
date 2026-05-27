import "dotenv/config";
import app from './app.js';
import {config} from './config/index.js';
// import {connectDB} from './shared/database.js';

const port = Number(config.port);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
