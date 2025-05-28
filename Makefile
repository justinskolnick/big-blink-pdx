include .env

.PHONY: logs
logs:
	docker logs -f --tail 50 web

.PHONY: shell
shell:
	docker exec -it web /bin/bash

.PHONY: db
db:
	docker exec -it db /bin/bash

.PHONY: dump
dump:
	docker exec db sh -c 'mariadb-dump -uroot -p"${DB_PASSWORD}" "${DB_DATABASE}"' > ./config/docker/db/init/lobby.sql
