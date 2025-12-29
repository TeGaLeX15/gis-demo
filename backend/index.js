const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/points', (req, res) => {
  res.json({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          title: "Центр Астаны",
          description: "Первая точка"
        },
        geometry: {
          type: "Point",
          coordinates: [71.4704, 51.1605]
        }
      },
      {
        type: "Feature",
        properties: {
          title: "Вторая точка",
          description: "Ещё одна локация"
        },
        geometry: {
          type: "Point",
          coordinates: [71.4800, 51.1650]
        }
      }
    ]
  });
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
