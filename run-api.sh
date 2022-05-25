curl --silent \
localhost:3000/heroes

curl --silent \
-X POST \
-d '{"name": "Flash", "age": 99, "power": "speed"}' \
localhost:3000/heroes

curl --silent \
-X POST \
-d '{"invalid route"}' \
localhost:3000/heroes

curl --silent \
-X PUT \
-d '{"age": 75}' \
localhost:3000/heroes/7d8eea02-6227-43e7-86c6-2626c21b35a0