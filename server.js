const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const app = express();

const morgan = require('morgan');
app.use(morgan('common'));

const { DATABASE_URL, PORT } = require('./config')
const { BlogPost } = require('./models');


mongoose.connect(DATABASE_URL);

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.get('/blog-post-mongoose', (req, res) => {
    BlogPost.find()
        .then(blogPost => {
            console.log('FLAGG', blogPost)
            res.json({
                blogPost: blogPost.map(post => {
                    post.serialize();
                })
            })
            .catch(err => {
                console.error('ERROR', err)
                res.status(500).json({ message: 'Internal server error'});
                return
            })
        })
    console.log('hitting get');
})

app.get('/blog-post-mongoose/:id', (req, res) => {
    console.log('hitting get with req.params')
})

app.post('/blog-post-mongoose', (req, res) => {
    console.log('hitting post');
})

app.post('/blog-post-mongoose/:id', (req, res) => {
    console.log('hitting post with req.params')
})

app.delete('/blog-post-mongoose/:id', (req, res) => {
    console.log('hitting delete')
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