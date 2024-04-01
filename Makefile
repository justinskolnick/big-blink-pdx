include .env

shell:
	docker exec -it lobby-web-1 /bin/bash

db:
	docker exec -it lobby-db-1 /bin/bash

dump:
	docker exec lobby-db-1 sh -c 'mysqldump -uroot -p"${DB_PASSWORD}" "${DB_DATABASE}"' > ./config/docker/db/init/lobby.sql
