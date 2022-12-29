const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.de46jr0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const userCollection = client.db('socialbook').collection('users');
        const postCollection = client.db('socialbook').collection('posts');

        app.get('/posts', async (req, res) => {
            const query = {}
            const cursor = postCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts);
        });

        app.get('/userinfo', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts);
        });

        app.get('/posts/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) };
            const selectedPost = await postCollection.findOne(query);
            console.log(selectedPost)
            res.send(selectedPost);
        });


        app.get('/oneuser', async (req, res) => {
            const mail = req.query.email;
            console.log(mail)
            const query = {};
            const users = await userCollection.find(query).toArray();
            const user = users.filter(n => n.email === mail);
            res.send(user);
        })

        app.get('/onepost/:_id', async (req, res) => {
            const id = req.query._id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const selectedPost = await postCollection.findOne(query);
            console.log(selectedPost)
            res.send(selectedPost);
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.post('/post', async (req, res) => {
            const post = req.body;
            console.log(post);
            const result = await postCollection.insertOne(post);
            res.send(result);
        });

        app.put('/comment', async (req, res) => {
            const post = req.body;
            console.log(post);
            const result = await postCollection.comments.updateOne(post);
            res.send(result);
        });


    }
    finally {

    }

}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('socialbook server is running')
})

app.listen(port, () => {
    console.log('socialbook Server running on port', port);
})
