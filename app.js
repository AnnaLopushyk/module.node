const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/users', async (req, res) => {
    const buffer = await fs.readFile(path.join(__dirname, 'dataBase', 'users.json'));

    const users = JSON.parse(buffer.toString());
    res.json(users);
});

app.get('/users/:userId', async (req, res) => {

    const {userId} = req.params;

    const buffer = await fs.readFile(path.join(__dirname, 'dataBase', 'users.json'));

    const users = JSON.parse(buffer.toString());

    const user = users.find((u) => u.id === +userId);

    if (!user) {
        return res.status(404).json(`User with id ${userId} not found`);
    }

    res.json(user);
})


app.post('/users', async (req, res) => {
    const userInf0 = req.body;

    const buffer = await fs.readFile(path.join(__dirname, 'dataBase', 'users.json'));
    const users = JSON.parse(buffer.toString());

    const newUser = {...userInf0, id: users[users.length - 1].id + 1};
    users.push(newUser);

    await fs.writeFile(path.join(__dirname, 'dataBase', 'users.json'), JSON.stringify(users));


    res.status(201).json(newUser)
});

app.put('/users/:userId', async (req, res) => {

    const newUserInfo = req.body;
    const {userId} = req.params;

    const buffer = await fs.readFile(path.join(__dirname, 'dataBase', 'users.json'));
    const users = JSON.parse(buffer.toString());

    const index = users.findIndex((u) => u.id === +userId);
    if (index === -1) {
        return res.status(404).json(`User with id ${userId} not found`);
    }

    users[index] = {...users[index], ...newUserInfo};

    await fs.writeFile(path.join(__dirname, 'dataBase', 'users.json'), JSON.stringify(users));

    res.status(201).json(users[index]);
})

// app.get('/', (req, res) => {
//     res.json('welcome')
// })

// app.delete ('/users/:id', (req, res) => {
//     const id = req.params.id;
//     res.json(userDB[id]);
// })

app.delete('/users/:userId', async (req, res) => {

    const {userId} = req.params;

    const buffer = await fs.readFile(path.join(__dirname, 'dataBase', 'users.json'));
    const users = JSON.parse(buffer.toString());

    const index = users.findIndex((u) => u.id === +userId);
    if (index === -1) {
        return res.status(404).json(`User with id ${userId} not found`);
    }

    users.splice(index, 1);

    await fs.writeFile(path.join(__dirname, 'dataBase', 'users.json'), JSON.stringify(users));

    res.sendStatus(204);
})

app.listen(5000, () => {
    console.log('server listen 5000');
})
