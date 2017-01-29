#FB-Peek
This project provides a set of tools to index and search your personal archive of Facebook data.

## What you need
* Your Facebook archive available under Facebook Settings->General->Download a copy of your data
* A Docker environment with docker-compose configured (otherwise some know-how on running each service individually)

## Running
1. Extract your facebook archive into a folder colled "archive" in the root of the repository
2. Edit `frontend/config.env` with the appropriate hostname for your Docker configuration. If you're running everything on localhost you can skip this step.
3. Run `docker-compose up` and wait while your data is indexed
4. Visit your docker host IP at port 8080 to search your data!
