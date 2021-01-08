const { request, response } = require('express');
const { connection } = require('../db_connection');
const router = require('express').Router();

//Display all albums
router.get('/', (request, response) => {
    const sql = "SELECT * FROM album";
    connection.query(sql, (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: "Cannot display your albums" });
        } else {
            response.status(200).json(results);
        }
    });
});

//Add a new album
router.post('/add', (request, response) => {
    const sql = "INSERT INTO album SET ?";
    connection.query(sql, request.body, (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: "Cannot add your album" });
        } else {
            response.status(201).json({ id: results.insertId, ...request.body });
        }
    });
});

//Display a specific album by its id
router.get('/:id', (request, response) => {
    const sql = "SELECT * FROM album WHERE id=?";
    connection.query(sql, [request.body, request.params.id], (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: `Cannot find album id: ${request.params.id}` })
        } else {
            response.status(200).json(results);
        }
    });
});

//Delete an album
router.delete('/delete/:id', (request, response) => {
    const sql = "DELETE FROM album WHERE id=?";
    connection.query(sql, request.params.id, (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: `Could not delete album id: ${request.params.id}` });
        } else {
            response.sendStatus(200);
        }
    });
});

//Modify an album
router.put('/modify/:id', (request, response) => {
    let sql = "UPDATE album SET ? WHERE id=?";
    connection.query(sql, [request.body, request.params.id], (err, results) => {
        if (err) {
            response.status(500).send({ errorMessage: `cannot modify the album id: ${request.params.id}` });
        } else {
            sql = "SELECT * FROM album WHERE id=?";
            connection.query(sql, req.params.id, (err, result) => {
                if (result.length === 0) {
                    res.status(404).send({ errorMessage: `Album with id ${req.params.id} not found` });
                } else {
                    res.status(200).json(result[0]);
                }
            });
        }
    });
});

module.exports = router;