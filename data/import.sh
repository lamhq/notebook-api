#!/bin/sh
cd "$(dirname "$0")"

# local
DB_URI='mongodb://localhost:27017/notebook'

mongoimport --uri ${DB_URI} --collection administrators --file administrators.json --jsonArray --drop
mongoimport --uri ${DB_URI} --collection activities --file activities.json --jsonArray --drop
mongoimport --uri ${DB_URI} --collection tags --file tags.json --jsonArray --drop

mongo ${DB_URI} < ./setup.js
