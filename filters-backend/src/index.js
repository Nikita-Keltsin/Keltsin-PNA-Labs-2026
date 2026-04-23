const express = require('express');
const path = require('path');
const cors = require('cors');
const filterRoutes = require('./routes/filters');
const filterService = require('./services/filterService');

const app = express();
filterService.init(path.join(__dirname, 'data/filters.json'));

app.use(cors());
app.use(express.json());
app.use('/filters', filterRoutes);

app.listen(3000, () => console.log('Сервер запущен: http://localhost:3000'));