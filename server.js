const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

app.use(express.static('public'));

const PORT = process.env.PORT || 4000;

app.get('/api/employees', (req, res, next) => {
  const query = "SELECT * FROM Employee WHERE is_current_employee = 1";

  db.all(query, (err, rows) => {
    db.serialize(() => {
      res.json({employees: rows});
      res.status(200).send();
    });
  });
});

app.get('/api/employees/:id', (req, res, next) => {
  const employeeId = Number(req.params.id);

  const query = `SELECT * FROM Employee WHERE id = ${employeeId}`;
  db.get(query, (err, row) => {
    if (err) {
      res.status(404).send();
    } else {
      db.serialize(() => {
        res.json({employee: row});
        res.status(200).send();
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
