# MERN E-Commerce Docker Setup

## Prerequisites
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- MongoDB Atlas connection string (URI)

## Environment Variables
Create a `.env` file in the project root (or set variables in your environment):

```
MONGO_URI=your_mongodb_atlas_connection_string
```

## Build and Run with Docker Compose

```
docker-compose up --build
```

- Client: http://localhost:3000
- Server: http://localhost:5000

## Notes
- The server uses the `MONGO_URI` environment variable to connect to MongoDB Atlas.
- You can stop the containers with `docker-compose down`.
- For development, code changes will reflect automatically due to volume mounts, but you may need to rebuild for dependency changes. 