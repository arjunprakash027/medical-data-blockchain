const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Add this line
const app = express();

const main = require('./upload-data.js');
const get_value = require('./retreive_location.js');

app.use(express.static('public'));
app.use(bodyParser.json());

// Define route to serve interface.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'interface.html'));
});

app.post('/uploadData', async (req, res) => {
  try {
    const contractAddress = await main();
    console.log(contractAddress)
    res.status(200).json({ address:contractAddress });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/retrieve', async (req, res) => { // Corrected route path to '/retrieve'
    try{
        const blockId = req.body.block;
        const location = await get_value(blockId);
        console.log("loc",location)
        res.status(200).json({location:location});
    } catch (error) { // Added 'error' parameter here
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3002, () => {
  console.log('Server is running on port 3000');
});
