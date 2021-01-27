const {connection} = require('../db_connection');
const router = require('express').Router();

// Get général.
router.get('/', function (req, res) {
    connection.query('SELECT * FROM album', (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
});

// as a user, I want to be able to create a new album.
router.post('/', (request, response) => {
    connection.query('INSERT INTO album SET ?', request.body, (error, result) => {
      if (error) {
        response.status(500).json(error);
      } else {
        response.status(201).json({
          id: result.insertId,
          ...request.body,
        });
      }
    });
});

// as a user, I want to be able to see an album by entering its id in the url.
router.get('/:id', function (request, response) {
  connection.query(
    'SELECT * FROM album WHERE id = ?',
    request.params.id,
    (err, result) => {
      if (err) {
        response.status(500).json(err);
      } else if (result.length < 1) {
        response.sendStatus(404);
      } else {
        response.status(200).json(result);
      }
    }
  );
});

// BONUS
router.get('/search', function (req, res) {
  const title = req.query.title;
  const genre = req.query.genre;
  const artist = req.query.artist;

  let sqlParams = [];
  let sqlRequest = 'SELECT * FROM album WHERE 1=1';
  if (title) {
    sqlRequest += ' AND title = ?';
    sqlParams.push(title);
  }
  if (genre) {
    sqlRequest += ' AND genre = ?';
    sqlParams.push(genre);
  }
  if (artist) {
    sqlRequest += ' AND artist = ?';
    sqlParams.push(artist);
  }
  console.log(sqlRequest, sqlParams);

  connection.query(sqlRequest, sqlParams, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  });
});

// as a user, I want to be able to modify an album.
router.put('/:id', (request, response) => {
    connection.query(
      'UPDATE album SET ? WHERE id = ?',
      [request.body, request.params.id],
      (error, result) => {
        if (error) {
          response.status(500).json(error);
        } else {
          // TODO : select album from database
          response.status(200).json({
            ...request.body,
          });
        }
      }
    );
});
 
// as a user, I want to be able to delete an album.
router.delete('/:id', function (req, res) {
    connection.query(
      'DELETE FROM album WHERE id = ?',
      req.params.id,
      (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else if (result.affectedRows < 1) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      }
    );
});
  
module.exports = router;