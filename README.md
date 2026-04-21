# The Big Blink PDX

## Introduction

**The Big Blink PDX** is a website that remixes lobbying data published by the City of Portland, Oregon, with the primary goal of surfacing relationships and highlighting activity over time.

The site's Express/Node.js back-end functions as a REST API for a React front-end driven by React Router and Redux. The front-end is built in TypeScript. The full production database and downloaded records are included in the repository.

Technical goals for the project included spinning up a Node app from zero, scoping out key differences between mariaDB and MySQL, getting more comfortable writing complex SQL queries, and playing with a few new-to-me front-end tools, including Redux Toolkit and React Router's data object strategy. This project also marked an admittedly stumbling transition from OG Yarn to Yarn Berry, which felt a little dangerous. In general, and although my longtime development approach is to keep the overall dependency count low and own as much of the codebase as I can, for this project I wanted to see how fast I could get an MVP online using off-the-shelf libraries configured as closely as possible to their recommended implementations. Pretty fast, it turns out.

## Installation

### Getting up and running

First, install [Docker Desktop](https://www.docker.com/products/docker-desktop) on your computer.

Next, clone this repository and `cd` into the directory in your Terminal.

The [dotenv](https://github.com/motdotla/dotenv) package is included for development. To configure your instance with it, create a new `.env` file in the root directory, using the following block as a template. If the values for `DB_USER` and `DB_DATABASE` aren't your thing, edit `config/docker/db/init/init.sql` to match your new values before you build the project.

```env
DB_HOST="db"
DB_USER="user"
DB_PASSWORD=""
DB_DATABASE="lobby"
DB_PORT=3306
DB_SOCKET=""
```

> [!WARNING]
> Never commit a `.env` file to a repository.

Return to the command line, make sure you're still in the project root, and build the project:

```
docker compose build
```

If everything goes right, you can start it up like this:

```
docker compose up
```

Once the project is up and running, pop open a web browser and navigate to `http://localhost:3000`

The Docker installation can be stopped like this:

```
docker compose stop
```

### Making changes to the front-end

Assets are built with [Yarn](https://yarnpkg.com). The Docker build installs Yarn inside the container. To access and edit the assets for either container, `docker compose up` and log into the container. A Makefile has been added for convenience.

```
make shell
```

Once inside the container, you can edit the assets. Local/development assets (styles and scripts) are compiled from the files in `assets` with:

```
yarn build:dev
```

or can be built in watch mode:

```
yarn watch
```

Production (minified) assets are compiled from the same files with:

```
yarn build
```

## Ongoing Development

Items on the UI wishlist include ~date range filters,~ ✔︎ localization, and better visualizations. Improvements to data fetching and transitions between routes are nearish-term goals.

Longish-term back-end development goals include ~a move away from the current model implementation, which makes heavy use of static methods (with some pretty obvious limitations)~ ✔︎; increased test coverage; and a TypeScript rebuild.

## Contributing

Issues and PRs are welcome. And spot fixes are more welcome than overhauls. If you've got an idea for a big change, reach out.

## License

Copyright (c) 2023-2026 Justin Skolnick. [MIT License](/LICENSE).
