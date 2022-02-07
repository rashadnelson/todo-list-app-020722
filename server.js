const express = require('express');
const app = express(); // All the functions in express are now in app.
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 8000;
require('dotenv').config();

// MONGODB CONNECTION
let db,
	dbConnectionStr = process.env.DB_STRING,
	dbName = 'todo';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	(client) => {
		console.log(`Connected to ${dbName} Database`);
		db = client.db(dbName);
	}
);

// SERVER AND MIDDLEWARE SETUP
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API - MADE UP OF GET, POST, DELETE, AND UPDATE

// GET / READ REQUEST
app.get('/', (request, response) => {
	db.collection('todos')
		.find()
		//.sort({ likes: -1 }) // ITEMS IN THE DATABASE ARE SORTED BASED ON THEIR LIKES PROPERTY, FROM MOST TO LEAST
		.toArray()
		.then((data) => {
			response.render('index.ejs', { items: data });
		})
		.catch((error) => console.error(error));
});

// POST / CREATE REQUEST
app.post('/addThing', (request, response) => {
	db.collection('todos')
		.insertOne(request.body)
		.then((result) => {
			console.log('Thing Added');
			response.redirect('/');
		})
		.catch((error) => console.error(error));
});

// DELETE REQUEST
app.delete('/deleteThing', (request, response) => {
	db.collection('todos')
		.deleteOne({ thing: request.body.itemFromJS })
		.then((result) => {
			console.log('Thing Deleted');
			response.json('Thing Deleted');
		})
		.catch((error) => console.log(error));
});

// PUT / UPDATE REQUEST
app.put('/markComplete', (request, response) => {
	db.collection('todos')
		.updateOne(
			{
				thing: request.body.itemFromJS,
			},
			{
				$set: {
					completed: true,
				},
			},
			{
				sort: { _id: -1 }, // FINDS THE FIRST MATCH, THEN STOP LOOKING, UPDATE THE ONE THAT WAS FOUND
				upsert: true, // IF THE MATCH IS NOT FOUND, JUST GO AHEAD AND CREATE A NEW DOCUMENT IN THE DATABASE.
			}
		)
		.then((result) => {
			console.log('Marked Completed');
			response.json('Marked Complete');
		});
});

// PUT / UPDATE REQUEST
app.put('/markUnComplete', (request, response) => {
	db.collection('todos')
		.updateOne(
			{
				thing: request.body.itemFromJS,
			},
			{
				$set: {
					completed: false,
				},
			},
			{
				sort: { _id: -1 }, // FINDS THE FIRST MATCH, THEN STOP LOOKING, UPDATE THE ONE THAT WAS FOUND
				upsert: false, // IF THE MATCH IS NOT FOUND, JUST GO AHEAD AND CREATE A NEW DOCUMENT IN THE DATABASE.
			}
		)
		.then((result) => {
			console.log('Marked Uncompleted');
			response.json('Marked Uncompleted');
		});
});

// SERVER TO LISTEN TO PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
