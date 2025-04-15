include .env

logs:
	docker logs -f --tail 50 web

shell:
	docker exec -it web /bin/bash

db:
	docker exec -it db /bin/bash

dump:
	docker exec db sh -c 'mariadb-dump -uroot -p"${DB_PASSWORD}" "${DB_DATABASE}"' > ./config/docker/db/init/lobby.sql
