/* eslint-env mongo */
// this file contain javascript code to be executed in mongo shell
// resposible for setting up mongo database

// create an ascending index on field `time`
db.activities.createIndex({ time: 1 });

// create an text index on field `content` and `tags`
db.activities.createIndex({ content: 'text', tags: 'text' });
