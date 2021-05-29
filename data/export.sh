#!/bin/sh
cd "$(dirname "$0")"

# local
DB_URI=mongodb://localhost:27017/notebook

mongoexport --uri ${DB_URI} -c administrators --out administrators.json --jsonArray --pretty