const { request, response } = require('express');
const { connection } = require('../db_connection');
const router = require('express').Router();

//Add a new song
router.post('/add', (request, response) => {
    const sql = "INSERT INTO track SET ?";
    connection.query(sql, request.body, (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: 'Sorry cannot add this song' });
        } else {
            response.status(201).json({ id: results.insertId, ...request.body });
        }
    });
});

//Display all the songs
router.get('/', (request, response) => {
    const sql = "SELECT * FROM track";
    connection.query(sql, (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: "Cannot get the songs" });
        } else {
            response.status(200).json(results);
        }
    });
});

//Get all the songs of an album
router.get('/album/:title', (request, response) => {
    const sql = "SELECT album.title, track.title, artist FROM track INNER JOIN album ON track.id_album=album.id WHERE album.title=?";
    connection.query(sql, request.params.title, (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: `Sorry cannot get the song of the album: ${request.params.title}, check if it is the right one` });
        } else {
            response.status(200).json(results);
        }
    });
});

//Delete a song
router.delete('/delete/:id', (request, response) => {
    const sql = "DELETE FROM track WHERE id=?";
    connection.query(sql, request.params.id, (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: `Could not delete song id: ${request.params.id}` });
        } else {
            response.sendStatus(200);
        }
    });
});

//Modify a song
router.put('/modify/:id', (request, response) => {
    let sql = "UPDATE track SET ? WHERE id=?";
    connection.query(sql, [req.body, req.params.id], (err, results) => {
        if (err) {
            res.status(500).send({ errorMessage: `Cannot modify the song id: ${request.params.id}` });
        } else {
            sql = "SELECT * FROM track WHERE id=?";
            connection.query(sql, req.params.id, (err, result) => {
                if (result.length === 0) {
                    res.status(404).send({ errorMessage: `Cannot find song with id ${req.params.id}` });
                } else {
                    res.status(200).json(result[0]);
                }
            });
        }
    });
});
module.exports = router;