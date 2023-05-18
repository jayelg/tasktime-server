const express = require("express"); 
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const v1ProjectRouter = require("./v1/routes/projectRoutes");
const v1ItemRouter = require("./v1/routes/itemRoutes");

require('dotenv').config();
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express(); 
const PORT = process.env.PORT || 3010;

app.use(bodyParser.json());
app.use(express.static(`public`));
app.use("/api/v1/projects", v1ProjectRouter);
app.use("/api/v1/items", v1ItemRouter);

app.listen(PORT, () => { 
    console.log(`Tasktime API is listening on port ${PORT}`); 
});