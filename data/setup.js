// this file contain javascript code to be executed in mongo shell
// resposible for setting up mongo database

db.activities.createIndex({ 'content': 'text', 'tags': 'text' });