'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const app = express();

const { DATABASE_URL, PORT } = require('./config')
const { BlogPost } = require('./models');

app.use(morgan('common'));
app.use(express.json());
// app.use(express.static('public'));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/index.html');
// })

app.get('/blog-post-mongoose', (req, res) => {
    BlogPost
        .find()
        .then(posts => {
            res.json({blogPost: posts.map(post => post.serialize())})    
        })
        .catch(err => {
            console.error('ERROR', err);
            res.status(500).json({ error: 'Something went wrong'});
        });
})

app.get('/blog-post-mongoose/:id', (req, res) => {
    // let filters = {};
    // const queryableFields = ['title'];
    // queryableFields.forEach(field => {
    //     if (req.query[field]) {
    //         filters[field] = req.query[field];
    //     }
    // });
    BlogPost
        .findById(req.params.id)
        .then(post => {
            res.json(post.serialize())
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Something went wrong'})
        })
})

app.post('/blog-post-mongoose', (req, res) => {
    const requiredFields = ['title', 'content'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in req.body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    BlogPost
        .create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        })
        .then(post => {
            res.status(201).json(post.serialize())
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Something went wrong'})
        })
    console.log('hitting post')
})

app.put('/blog-post-mongoose/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = `${req.params.id} and ${req.body.id} must be the same`;
        console.error(message);
        return res.status(400).json({message: message});
    }

    let toUpdate = {};
    let updateableFields = ['title', 'content', 'author'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    BlogPost
        .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
        .then(updatedPost => {
            res.status(204).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Something went wrong'})
        })
    console.log('hitting post with req.params')
})

app.delete('/blog-post-mongoose/:id', (req, res) => {
    BlogPost
        .findByIdAndRemove(req.params.id)
        .then(post => {
            res.status(204).end();
        })
})

let server;
function runServer(databaseUrl, port= PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`)
                resolve();
            })
            .on("error", err => {
                mongoose.disconnect();
                reject(err);
            });
        })
    });
}


function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log("Closing Server");
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

  if(require.main === module) {
      runServer(DATABASE_URL).catch(err => console.error(err));
  }

  module.exports = { app, runServer, closeServer };