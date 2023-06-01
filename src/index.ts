const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const v1Router = require("./v1/routes/");
import { connect, connection } from 'mongoose';
require('dotenv').config();

const mongoString = process.env.DATABASE_URL
typeof mongoString === "string" ? connect(mongoString) : null;
const database = connection;
database.on('error', (error: Error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express(); 
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(`public`));
app.use("/api/v1/projects", v1Router);

app.listen(PORT, () => { 
    console.log(`Tasktime API is listening on port ${PORT}`); 
});