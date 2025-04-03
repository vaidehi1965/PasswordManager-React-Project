const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors')

dotenv.config();

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'passop';
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors())

client.connect();

// Get all the passwords
app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  const findResult = await collection.find({}).toArray();
  res.json(findResult); // Send the result as JSON
});

// Save a password
app.post('/', async (req, res) => {
  try {
    // Validate request body
    if (!req.body || !req.body.site || !req.body.username || !req.body.password) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true})// Send the result as JSON
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Delete a password by id

app.delete('/', async (req, res) => {
  try {
    const password = req.body; // Assuming the password object contains the necessary fields to delete the record

    // Make sure to specify the field you are trying to match (e.g., password.id)
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    
    // Assuming you're deleting by some identifier, like 'id' or 'password'
    const findResult = await collection.deleteOne({ id: password.id });

    if (findResult.deletedCount === 0) {
      res.status(404).send({ success: false, message: 'No document found to delete' });
    } else {
      res.send({ success: true, result: findResult });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});