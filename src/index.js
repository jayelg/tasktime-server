const express = require("express"); 
const bodyParser = require("body-parser");
const v1ItemRouter = require("./v1/routes/itemRoutes");

const app = express(); 
const PORT = process.env.PORT || 3010;

app.use(bodyParser.json());
app.use(express.static(`public`));
app.use("/api/v1/items", v1ItemRouter);

app.listen(PORT, () => { 
    console.log(`API is listening on port ${PORT}`); 
});