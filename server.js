const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configure multer so that it will upload to '/public/images'
const multer = require('multer');
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  path: String,
  price: String,
  purchase: Boolean,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// CREATE
app.post('/api/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    price: req.body.price,
    purchase: false,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// READ
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//DELETE
app.delete( '/api/items/:id', async(req,res)=> {
  await Item.deleteOne({_id:req.params.id});
});

//UPDATE
app.put( '/api/items/:id', async(req,res)=> {
  let item = await Item.findOne({_id:req.params.id});
  item.title = req.body.title;
  item.price = req.body.price;
  item.purchase = req.body.purchase;
  await item.save();
  res.send(item);
});

app.listen(4208,() => console.log('Server listening on port 4208!'));

