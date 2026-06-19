import "dotenv/config";
import app from './app.js';
import { config } from './config/index.js';
import "../src/modules/jobs/priceAlertJob.js";
import "../src/modules/jobs/listingExpiryJob.js";
// import {connectDB} from './shared/database.js';
const port = Number(config.port);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=server.js.map