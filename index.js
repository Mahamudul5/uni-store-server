const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, MongoRuntimeError, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdjpc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('uniStoreHouse').collection('item');
        const reviewCollection = client.db('CarMad').collection('reviews');
        const ordersCollection = client.db('CarMad').collection('orders');
        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });
        app.get('/orders', async (req, res) => {
            const query = {};
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        //  delete item 
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            res.send(result)
        });
        app.post('/reviews', async (req, res) => {
            const newOrder = req.body;
            const result = await reviewCollection.insertOne(newOrder);
            res.send(result)
        })


        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateUser.Newquantity,
                },

            };
            const result = await itemCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
    }
    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('uni-store-server running');
});

app.listen(port, () => {
    console.log('listening port', port);
})
