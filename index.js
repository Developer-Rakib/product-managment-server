const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.nbflg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const ProductCollection = client.db("productManager").collection("product");

        // get data 
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = ProductCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })
        // Create Data 
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await ProductCollection.insertOne(product);
            res.send(result)
        })
        // Upgade Data 
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            let filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: product
            };
            const result = await ProductCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // Delete Data 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            let query = { _id: ObjectId(id) }
            const result = await ProductCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {
        // perform actions on the collection object
        // client.close();
    }

}
run().catch(console.dir())



// get 
app.get('/', (req, res) => {
    res.send("CRUD PRODUCT")
})



app.listen(port, () => {
    console.log("CRUD operation is Start", port);
})

