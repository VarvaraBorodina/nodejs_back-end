
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

# REST Api routes:
## User registration
`POST /regist` 
### Request:
```
{
    email : string (valid email),
    password : string (longer then 8 symbols),
    firstName : string,
    lastName : string,
}
```
### Response:
```
{ 
    accessToken : string
    refreshToken : string (saved to cookies) 
    user : {
        id: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        image: string | null,
        pdf: Buffer | null
    } 
}
```

## Log in 
`POST /login` 
### Request:
```
{
    email : string,
    password : string
}
```
### Response:
```
{ 
    accessToken : string
    refreshToken : string (saved to cookies) 
    user : {
        id: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        image: string | null,
        pdf: Buffer | null
    } 
}
```

## Refresh access token 
`GET /refreshToken` 

### Response:
```
{ 
    accessToken : string
    refreshToken : string (saved to cookies) 
}
```

## Log out 
`POST /logout` 

### Response:
```
 message: refresh_token deleted
```

## Get all users from database
Need authorization.

`GET /getAllUsers` 

### Response:
```
[
    {
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    image: string | null,
    pdf: Buffer | null
    }, 
    {
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    image: string | null,
    pdf: Buffer | null
    },
    ...
]
```

## Get user by id
Need authorization.

`GET /getUserById/:id` 

### Response:
```
{
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    image: string | null,
    pdf: Buffer | null
}
```

## Update user
Need authorization. Can update only first name and last name. Return updated user.

`PUT /updateUser/:id` 

### Request: 
```
{
    firstName: string?
    lastName: string?
}
```

### Response:
```
{
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    image: string | null,
    pdf: Buffer | null
}
```

## Upload user image
Need authorization. Upload image on server and save link to it in data base. Update image if the user had image before. Return updated user.

`POST /uploadImage/:id` 

### Request: 
```
{
    form-data: {
        image: file (*.png, *.jpg)
    }
}
```

### Response:
```
{
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    image: string | null,
    pdf: Buffer | null
}
```

## Delete user
Need authorization.

`DELETE /deleteUser/:id` 


### Response:
```
{
    message: deleted
}
```

## Create Pdf

Need authorization. Find user by email in the database. Create pdf with user image, user first name and user last name. Save pdf in the database as binary file.

`GET /createPDF`

### Request

```
{
    email: string
}
```

### Response 
```
{
    message: true (if file was created and saved correctly)
}
```

