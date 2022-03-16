const express = require('express');
const app = express();
const PORT = process.env.PORT || 1000;
const path = require('path');
__dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
    console.log('app is running on port: ' + PORT);
});