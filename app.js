// Importa los módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = require('./config/db').mongoURI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(db.uri, db.options)
    .then(() => console.log('Conexión exitosa a la base de datos.'))
    .catch(err => console.error('Error de conexión a la base de datos:', err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Rutas para el CRUD
// Crear un usuario
app.post('/users', (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then(function (user) {
            return res.status(201).json(user);
        })
        .catch(function (err) {
            return res.status(400).json({ error: err });
        });
});

// Obtener todos los usuarios
app.get('/users', (req, res) => {
    User.find()
        .then((users) => {
            return res.status(201).json(users);
        })
        .catch((err) => {
            return res.status(400).json({ error: err });
        });
});

// Obtener un usuario por ID
app.get('/users/:id', (req, res) => {
    User.find({ _id: req.params.id })
        .then((users) => {
            return res.status(201).json(users);
        })
        .catch((err) => {
            return res.status(400).json({ error: err });
        });
});

// Actualizar un usuario
app.put('/users/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then((user) => {
            return res.status(201).json(user);
        })
        .catch((err) => {
            return res.status(400).json({ error: err });
        });
});

// Eliminar un usuario
app.delete('/users/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then((user) => {
            return res.status(201).json(user);
        })
        .catch((err) => {
            return res.status(400).json({ error: err });
        });
});

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
