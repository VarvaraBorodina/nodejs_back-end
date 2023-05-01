# nodejs_back-end
Back-end API server with node.js with authorization, the ability to upload images and the ability to generate pdf-files based on images.
## Technologies used:
- Docker
- Node.js
- Express
- PostgreSQL
- Typescript
- JWT
- Prisma
- Knex
- Munter
- Pdfkit

## Run the application:
Run server : `docker-compose up` <br />
Create table in database : `npm run migrate:docker` <br />
Open PostgreSQL cli : `npm run db-console:docker`, password to database enter is "password" <br />

# Api routes:
## User registration
`POST /regist` 
```
### Request : <br />
email (valid email) , password (longer then 8 symbols), firstName, lastName
```
