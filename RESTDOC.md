## API Documentation - Endpoints

The host name in non production is: ```http://localhost:3000``` and the base url is ```/api/v1``` 

So in total this becomes: ```http://localhost:3000/api/v1```

TODO: CHANGE THIS
Use Postman to try the requests through: 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/1c25a1f5acd8a33ce8ea)

### Authentication 

*  **POST** -> /registerWithAdmin

_Example request:_
``` javascript
{
	"username": "USER_NAME",
	"password": "PASSWORD",
	"appType": "systemAdmin",
	"organisation": {
		"id": "1",
		"name": "NAME"
	},
	"affiliation": {
		"id": "1",
		"name": "NAME"
	}
}

```
Be sure to set header _Authorization_ with the value of ```AUTH_ADMIN_SECRET``` from the ```.env``` file.

*  **POST** -> /login

_Example request:_
``` javascript
{
	"username": "A_USERNAME",
	"password": "A_PASSWORD"
}
```

_Example response:_
``` javascript
{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.      eyJ1c2VyIjp7ImlkIjoiMDA5MDNhOTgtZGVkMy00MmMxLWJjZDUtNGIyOWUyNzg4MjFmIiwidXNlcm5hbWUiOiJNb3J0ZW4iLCJvcmdhbmlzYXRpb24iOnsiaWQiOiIxIiwibmFtZSI6ImJsYSJ9LCJhZmZpbGlhdGlvbiI6eyJpZCI6IjEiLCJuYW1lIjoiYmxhYmxhIn19LCJpYXQiOjE1NDU5OTQ2MDEsImV4cCI6MTU1MjA0MjYwMX0.8nu8MtCkQfEMKXpdPCiTpEIG0GZdgoBdHErVHcTHTrw",
    "username": "Morten",
    "affiliation": "blabla"
}
```

*  **POST** -> /register

_Example request:_
``` javascript
{
	"username": "USER_NAME",
	"password": "A_PASSWORD",
	"organisation": {
		"id": "1",
		"name": "NAME"
	},
	"affiliation": {
		"id": "1",
		"name": "Butik 1"
	}
}
```
Be sure to set header _Authorization_ with the value of ```token``` from a login response from a systemAdmin

*  **Get** -> /users

_Example response:_
``` javascript
{
    "status": "ok",
    "msg": "successfully retrieved users",
    "users": [
        {
            "username": "A_USER_NAME"
            "affiliation": {
                "id": "123",
                "name": "SHOP_NAME"
            }
        }
        ...
    ]
}
```
Be sure to set header _Authorization_ with the value of ```token``` from a login response from a systemAdmin

### Organisations

