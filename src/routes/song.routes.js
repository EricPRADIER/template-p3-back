const {connection} = require('../db_connection');
const router = require('express').Router();

// as a user, I want to create and assign a song to an album.
router.post('/', (request, response) => {
    connection.query('INSERT INTO track SET ?', request.body, (error, result) => {
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

// as a user, I want to list all the songs from an album.
router.get('/albums/:id', function (request, response) {
    connection.query(
        'SELECT * FROM track WHERE album_id = ?',
        request.params.id,
        (err, result) => {
        if (err) {
            response.status(500).json(err);
        } else {
            response.status(200).json(result);
        }
    });
});

// as a user, I want to delete a song.
router.delete('/:id', function (req, res) {
    connection.query(
        'DELETE FROM track WHERE id = ?',
        req.params.id,
        (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else if (result.affectedRows < 1) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    });
});

// as a user, I want to edit a song from an album.
router.put('/:id', (request, response) => {
    connection.query(
        'UPDATE track SET ? WHERE id = ?',
        [request.body, request.params.id],
        (error, result) => {
        if (error) {
            response.status(500).json(error);
        } else {
            response.status(200).json({
            ...request.body,
            });
        }
    });
});

module.exports = router;