const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// временный массив пользователей
const usersDB = [];

// временный массив точек
const pointsDB = [
  {
    type: "Feature",
    properties: { title: "Центр Астаны", description: "Первая точка" },
    geometry: { type: "Point", coordinates: [71.4704, 51.1605] }
  },
  {
    type: "Feature",
    properties: { title: "Вторая точка", description: "Ещё одна локация" },
    geometry: { type: "Point", coordinates: [71.4800, 51.1650] }
  }
];

// Авторизация
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: 'Заполните все поля' });

  const exists = usersDB.find(u => u.username === username);
  if (exists) return res.status(400).json({ msg: 'Пользователь уже существует' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: usersDB.length + 1, username, password: hashedPassword };
  usersDB.push(newUser);

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, username });
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = usersDB.find(u => u.username === username);
  if (!user) return res.status(400).json({ msg: 'Пользователь не найден' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Неверный пароль' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, username });
});

// Middleware проверки JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Неверный токен' });
  }
};

// Получение точек
app.get('/api/points', authMiddleware, (req, res) => {
  res.json(pointsDB);
});

// Добавление точки
app.post('/api/points', authMiddleware, (req, res) => {
  const { title, description, coordinates } = req.body;
  if (!title || !coordinates) return res.status(400).json({ msg: 'Неверные данные' });

  const newPoint = {
    type: "Feature",
    properties: { title, description: description || '' },
    geometry: { type: "Point", coordinates }
  };
  pointsDB.push(newPoint);
  res.json({ msg: 'Точка добавлена', point: newPoint });
});

const path = require('path');
app.use('/web', express.static(path.join(__dirname, '../web')));

app.listen(process.env.PORT || 3000, () => {
  console.log(`API running on http://localhost:${process.env.PORT || 3000}`);
});