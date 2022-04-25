// Ici, je permets à mes requêtes SQL futures d'aboutir
// en créant une connexion avec ma DB perso
const connection = require('../db-config');
// on permet à notre fichier d'être associé à la 
// méthode Router d'express
const router = require('express').Router();

// sur le router, on associe 3 choses : le verbe d'action qui est ici get 
// pour lire l'info
// le chemin qui est /, sous entendu localhost:8000/api/monthème/
// une requête sql qui correspond à mes besoins : ici lire les produits 
// de l'entité product de la bdd
router.get('/', (req, res) => {
    // je crée ma connexion à la BDD
    connection.query('SELECT * FROM restaurant', (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving restaurants from database');
        }
        else 
        {
            res.json(results);
        }
    });
});

// Ici, je crée une route get par id pour chercher
// dynamiquement un objet précis dans ma data
router.get('/:id', (req, res) => {
    // Je dois prévoir d'abord la lecture du param 
    // de l'url
    const restaurantId = req.params.id
    connection.query('SELECT * FROM restaurant WHERE id=?',
    [restaurantId],
    (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving restaurants from database');
        }
        else 
        {
            if (results.length) res.json(results[0]);
            else res.status(404).send('Restaurant not found');
        }
    });
});

// Maintenant, j'aimerais pouvoir ajouter de la data dans ma DB
// sur ce thème précis évidemment
router.post('/', (req, res) => {
    // Ici je déscructure le corps de ma requête
    // Corps de ma requête = propriétés de ma table DB
    // (au moins, ce qui est en NOT NULL par défaut)
    const { name, category, adress } = req.body;
connection.query(
    'INSERT INTO restaurant (name, category, adress) VALUES (?, ?, ?)',
    [name, category, adress],
    (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving restaurants from database');
        }
        else 
        {
            const id = result.insertId;
            // Ici je définis ce que je veux voir en tant que retour json
            const createdRestaurant = { id, name, category, adress };
            res.status(201).json(createdRestaurant);
        }
    }
)
})

// Maintenant, je veux pouvoir modifier des infos 
// concernant un produit 
router.put('/:id', (req, res) => {
    const restaurantId = req.params.id;
    const db = connection.promise();
    let existingRestaurant = null;

    db.query('SELECT * FROM restaurant WHERE id = ?', 
    [restaurantId])
    .then(([results]) => {
        existingRestaurant = results[0];
        if (!existingRestaurant) return Promise.reject('Restaurant not found')
        return db.query('UPDATE restaurant SET ? WHERE id = ?', [req.body, restaurantId]);
    })
    .then(() => {
        res.status(200).json({...existingRestaurant, ...req.body});
    })
    .catch((err) => {
        console.log(err);
        if (err === 'Restaurant not found')
        res.status(404).send(`Restaurant with id ${restaurantId} not found.`)
        else {
            res.status(500).send('Error updating restaurant from database');
        }
    });
});

// Dernière étape d'un CRUD "basique", il faut pouvoir supprimer
// une ligne de la DB (tuple, sous entendu un objet)
router.delete('/:id', (req, res) => {
    const restaurantId = req.params.id;
    connection.query(
        'DELETE FROM restaurant WHERE id = ?',
        [restaurantId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error while deleting a restaurant');
            }
            else
            {
                // On va chercher la ligne affectée en question
                // Si tout va, on renvoie donc un status 200 de suppression
                if(result.affectedRows) res.status(200).send('🎉 Restaurant deleted')
                else res.status(404).send('Restaurant not found!')
            }
        }
    )
})



// on exporte ici notre router du thème en question
// pour pouvoir le lire sur l'index.routes.js
module.exports = router; 