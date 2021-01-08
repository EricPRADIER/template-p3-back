const app = require('../app');
const {connection} = require('../db_connection');
const router = require('express').Router();


//création d'album

router.post('/album', (req, res) => {
  const {title, genre, picture, artist}= req.body;
    const sql = "INSERT INTO albums(title, genre, picture, artist) VALUES(?, ?, ?, ?)";
    connection.query(sql, [title, genre, picture, artist], (err, results) => {
      if (err) {
        res.status(500).send("Error to create album");
      } else {
        res.status(201).send("Album create succesfully");
      }
    });
  });
  
//affichage d'album

  router.get("/:id", (req, response) => {
    connection.query("SELECT * FROM albums WHERE id=?",[req.params.id],(err, results) => {
        if (err) {  
          console.log(err);
          response.status(404).send(`Not found...`);
        } else {
          response.status(200).json(results);
        }
      }
    );
  });

//Musique affilier a un album à sa création 
  router.post('/track', (req, res) => {
    const {title, youtube_url, id_album} = req.body;
    const sql = "INSERT INTO track (title, youtube_url, id_album) VALUES(?, ?, ?)";
    connection.query(sql, [title, youtube_url, id_album], (err, res) => {
      if (err) {
        res.status(500).send("Error to create track");
      } else {
        res.status(201).json({id: res.insertId, ...req.body});
      }
    });
  });
//Modification de l'affiliation d'une musique a un album
  router.put("/track/album/:id", (req, response) => {
    const newSong = req.body;
    connection.query("UPDATE album_id FROM track SET ? WHERE id=?",[newSong,req.params.id],(err, results) => {
        if (err) {  
          console.log(err);
          response.status(404).send(`Error upadating...`);
        } else {
          response.json({id: results.insertId, ...newSong});
        }
      }
    );
  });
// liste de tout les son appartenant a un album
  router.get("/album/track/:id", (req, response) => {
    connection.query("SELECT * FROM track WHERE album_id=?",[req.params.id],(err, results) => {
        if (err) {  
          console.log(err);
          response.status(404).send(`Not found...`);
        } else {
          response.status(200).json(results);
        }
      }
    );
  });
//suppression d'un album (a partir de l'url)
  router.delete("/album/:id", (req, response) => {
    connection.query("DELETE FROM albums WHERE id=?",[req.params.id],(err, response) => {
        if (err) {  
          console.log(err);
          response.status(500).send(`error`);
        } else {
          response.status(200).send("sucess");
        }
      }
    );
  });
// modification d'un album via le body
  router.put("/album/change/:id", (req, response) => {
    connection.query("UPDATE albums SET ? WHERE id=?",[req.body,req.params.id],(err, response) => {
        if (err) {  
          console.log(err);
          response.status(404).send(`error updating`);
        } else {
          response.status(200).json({id: response.insertId, ...req.body});
        }
      }
    );
  });
//suppression d'un son 
  router.delete("/track/:id", (req, response) => {
    connection.query("DELETE FROM track WHERE id=?",[req.params.id],(err, response) => {
        if (err) {  
          console.log(err);
          response.status(500).send(`error`);
        } else {
          response.status(200).send("sucess");
        }
      }
    );
  });
// modification d'un son (dans le body) à partir d'un album (dans l'url)
router.put("/track/change/:id", (req, response) => {
  connection.query("UPDATE track SET ? WHERE album_id=?",[req.body,req.params.id],(err, response) => {
      if (err) {  
        console.log(err);
        response.status(404).send(`error updating`);
      } else {
        response.status(200).send({id: response.insertId, ...req.body});
      }
    }
  );
});

module.exports = router;