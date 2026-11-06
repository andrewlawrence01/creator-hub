import 'dotenv/config';
import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.send('Welcome to CreatorHub!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorHub is running on port ${PORT}`);
});