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
