const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.de46jr0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const collection = client.db("test").collection("devices");

app.get('/', (req, res) => {
    res.send('socialbook server is running')
})

app.listen(port, () => {
    console.log('socialbook Server running on port', port);
})
