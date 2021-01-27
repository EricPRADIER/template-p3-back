const {connection} = require('../db_connection');
const router = require('express').Router();

// as a user, I want to create my profile
router.post('/', (request, response) => {
    connection.query('INSERT INTO user SET ?', request.body, (error, result) => {
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

// as a user, I want to add an album to my favorites
router.post('/:id/albums/:idAlbum', (request, response) => {
    connection.query(
        'INSERT INTO user_album(user_id, album_id) VALUES (?, ?)',
        [request.params.id, request.params.idAlbum],
        (error, result) => {
            if (error) {
                response.status(500).json(error);
            } else {
                response.sendStatus(201);
            }
        });
    });

// as a user, I want to list my favorites albums (only mines) 
router.get('/:id/albums', function (request, response) {
    connection.query(
        'SELECT * FROM album JOIN user_album ON album.id = user_album.album_id WHERE user_album.user_id = ?',
        request.params.id,
        (err, result) => {
            if (err) {
                response.status(500).json(err);
            } else {
                response.status(200).json(result);
            }
        });
    });
 
// as a user, I want to remove an album from my favorites    
router.delete('/:id/albums/:idAlbum', function (req, res) {
    connection.query(
        'DELETE FROM user_album WHERE album_id = ? AND user_id = ?',
        [req.params.idAlbum, req.params.id],
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
            
module.exports = router;