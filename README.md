# The Big Blink PDX

## Introduction

**The Big Blink PDX** is a website that remixes lobbying data published by the City of Portland, Oregon, with the primary goal of surfacing relationships and highlighting activity over time.

The site's Express/Node.js back-end functions as a REST API for a React front-end driven by React Router and Redux. The front-end is TypeScript. The full production database and downloaded records are included in the repository.

Technical goals for the project included spinning up a Node app from zero, scoping out key differences between mariaDB and MySQL, getting more comfortable writing complex SQL queries, and playing with a few new-to-me front-end tools, including Redux Toolkit and React Router's data object strategy. This project also marked an admittedly stumbling transition from OG Yarn to Yarn Berry, which feels a little dangerous. In general, and although my longtime development approach is to keep the overall dependency count low and own as much of the codebase as I can, for this project I wanted to see how fast I could get an MVP online using off-the-shelf libraries configured as closely as possible to their recommended implementations. Pretty fast, it turns out.

## Installation

### Getting up and running

After cloning this repository, make a new `.env` file in the root directory, using the following block as a template. If the values for `DB_USER` and `DB_DATABASE` aren't your thing, edit `config/docker/db/init/init.sql` to match your new values before you build the project. _Never commit a `.env` file to a repository._

```env
DB_HOST="db"
DB_USER="user"
DB_PASSWORD=""
DB_DATABASE="lobby"
DB_PORT=3306
DB_SOCKET=""
```

Install app packages with Yarn:

```
yarn install
```

A Dockerfile is provided for development. Init the project:
```
docker compose up
```

Once the containers are running, pop open a web browser and navigate to `http://localhost:3000`

### Making changes to the front-end

Front-end assets are built and managed locally. If you want to make changes to the site's user interface, `cd` into `assets` and install the packages there:

```
yarn install
```

## Ongoing Development

### Next steps
  - Add contextual date range filters
  - Add support for translations
  - Fix pagination link groupings
  - Look into alternatives to ChartJS
  - Start to migrate the underlying time unit from quarter to date
  - Ongoing UI bug fixes

### Things to improve
  - **Query optimization and cleanup**
    - There are inconsistencies and redundancies to iron out
    - With queries already lurching towards abstraction, a regular ORM might be in order
  - **The TypeScript implementation** — lots to do here
  - **Testing** — development prioritized getting pieces of the interface up and running, and there are gaps

### Long-range planning
  - Drop REST for GraphQL?
  - Rebuild the back-end in TypeScript
  - ~~Alternatives to Emotion for styling - a straightforward SCSS approach might do the job~~

## Contributing

Issues and PRs are welcome. And spot fixes are more welcome than overhauls. If you've got an idea for a big change, reach out.

## License

Copyright (c) 2023-2024 Justin Skolnick. [MIT License](/LICENSE).
