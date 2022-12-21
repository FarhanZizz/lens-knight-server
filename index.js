const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// MiddleWare
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d0hszsm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollections = client.db('lens-knight').collection('services')
        const reviewCollections = client.db('lens-knight').collection('reviews')

        app.get('/', async (req, res) => {
            const query = {}
            const cursor = serviceCollections.find(query).limit(3);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollections.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollections.findOne(query);
            res.send(result)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollections.findOne(query)
            res.send(result)
        })
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { reviewid: id }
            const cursor = reviewCollections.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const queryEmail = req.query.email;
            const query = { email: queryEmail }
            const cursor = reviewCollections.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.post('/reviews/new', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollections.insertOne(newReview);
            res.send(result)
        })
        app.delete('/review/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollections.deleteOne(query);
            res.send(result)
        })
    }
    finally { }
}

run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('server running');
});

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})