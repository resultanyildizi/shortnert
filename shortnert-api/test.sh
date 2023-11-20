#!/bin/zsh

HOST="localhost"
PORT="8000"

#URL="$HOST:$PORT/links/bxx"
#curl -X GET $URL

#URL="$HOST:$PORT/links"
#curl -X POST $URL -H "Accept: application/json" -H "Content-Type: application/json" -d '{"url": "http://resultanyildizi.com", "key": "bxx"}'  
#
URL="$HOST:$PORT/api/v1/links/32"
curl -X DELETE $URL

