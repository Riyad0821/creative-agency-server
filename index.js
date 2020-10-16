const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('orders'));
app.use(fileUpload());


const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qguwb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("creativeAgency").collection("services");
    const ordersCollection = client.db("creativeAgency").collection("ordersCol");
    const feedbacksCollection = client.db("creativeAgency").collection("feedbacks");
    const adminsCollection = client.db("creativeAgency").collection("admins");
    //   const registrationsCollection = client.db("volunteerNetwork").collection("registrations");

    // app.post('/addServices', (req, res) => {
    //     const services = req.body;
    //     servicesCollection.insertMany(services)
    //         .then(result => {
    //             console.log(result.insertedCount);
    //             res.send(result.insertedCount);
    //         })
    // })
    app.post('/addFeedbacks', (req, res) => {
        const feedbacks = req.body;
        feedbacksCollection.insertMany(feedbacks)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            })
    })
    // app.post('/addSingleReview', (req, res) => {
    //     const review = req.body;
    //     feedbacksCollection.insertOne(review)
    //       .then(result => {
    //         res.send(result.insertedCount > 0)
    //       })
    //   })

    app.get('/services', (req, res) => {
        servicesCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    app.get('/feedbacks', (req, res) => {
        feedbacksCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const title = req.body.title;
        const projectDetails = req.body.projectDetails;
        const price = req.body.price;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        ordersCollection.insertOne({ name, email, title, projectDetails, price, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addSingleService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var icon = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        servicesCollection.insertOne({ title, description, icon })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addSingleReview', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const designation = req.body.designation;
        const description = req.body.description;
        const icon = req.body.icon;
        feedbacksCollection.insertOne({name, email, designation, description, icon })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.insertOne({email})
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find({})
          .toArray((err, documents) => {
            res.send(documents);
          })
      })

      app.post("/checkUser", (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ email: email })
        .toArray((err, documents) => {
            res.send(documents.length > 0);
        })
      });


    app.get('/', (req, res) => {
        res.send('Hello folks, It is working.');
    })


    //   app.post('/addActivity', (req, res) => {
    //     const activities = req.body;
    //     activitiesCollection.insertMany(activities)
    //       .then(result => {
    //         console.log(result.insertedCount);
    //         res.send(result.insertedCount)
    //       })
    //   })

    //   app.post('/addEvent', (req, res) => {
    //     const events = req.body;
    //     activitiesCollection.insertOne(events)
    //       .then(result => {
    //         res.send(result.insertedCount > 0)
    //       })
    //   })

    //   app.delete('/admin', cors(), (req, res) => {
    //     registrationsCollection.deleteOne({_id: ObjectId(req.query._id) })
    //       .then(documents => {
    //         res.send(documents.deletedCount > 0);
    //         //res.redirect('/');
    //       })
    //   })


    //   app.get('/activities', (req, res) => {
    //     activitiesCollection.find({})
    //       .toArray((err, documents) => {
    //         res.send(documents);
    //       })
    //   })
    //   app.get('/lists', (req, res) => {
    //     registrationsCollection.find({})
    //       .toArray((err, documents) => {
    //         res.send(documents);
    //       })
    //   })
    //   app.get('/profile', (req, res) => {
    //     registrationsCollection.find({ email: req.query.email })
    //       .toArray((err, documents) => {
    //         res.send(documents);
    //       })
    //   })
    //   app.get('/activities/:serviceType', (req, res) => {
    //     activitiesCollection.find({ serviceType: req.params.serviceType })
    //       .toArray((err, documents) => {
    //         res.send(documents[0]);
    //       })
    //   })

    //   app.post('/addRegistration', (req, res) => {
    //     const registration = req.body;
    //     registrationsCollection.insertOne(registration)
    //       .then(result => {
    //         res.send(result.insertedCount > 0)
    //       })
    //   })
    console.log('Database Connected');
});

app.listen(process.env.PORT || port)