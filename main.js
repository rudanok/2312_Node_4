const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Joi = require('joi');
const userSchema = require('./userValidation');

const app = express();
app.use(bodyParser.json());

const usersFile = 'users.json';

let nextId = 3;

// Получение всех пользователей
app.get('/users', (req, res) => {
  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка чтения файла пользователей');
    } else {
      const users = JSON.parse(data);
      res.json(users);
    }
  });
});

// Добавление нового пользователя
app.post('/users', (req, res) => {
  const newUser = req.body;

  const { error } = userSchema.validate(newUser);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка чтения файла пользователей');
    } else {
      const users = JSON.parse(data);
      newUser.id = nextId++;
      users.push(newUser);

      fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Ошибка записи в файл пользователей');
        } else {
          res.status(201).json(newUser);
        }
      });
    }
  });
});

// Обновление данных пользователя по id
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updateUser = req.body;

  const { error } = userSchema.validate(updateUser);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка чтения файла пользователей');
    } else {
      let users = JSON.parse(data);
      const index = users.findIndex(user => user.id === userId);

      if (index === -1) {
        res.status(404).send('Пользователь не найден');
      } else {
        users[index] = { ...users[index], ...updateUser };

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Ошибка записи в файл пользователей');
          } else {
            res.json(users[index]);
          }
        });
      }
    }
  });
});

// Удаление пользователя по id
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка чтения файла пользователей');
    } else {
      let users = JSON.parse(data);
      const index = users.findIndex(user => user.id === userId);

      if (index === -1) {
        res.status(404).send('Пользователь не найден');
      } else {
        const deletedUser = users.splice(index, 1);

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Ошибка записи в файл пользователей');
          } else {
            res.json(deletedUser[0]);
          }
        });
      }
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
