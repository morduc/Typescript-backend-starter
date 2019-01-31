 ## API Documentation - Endpoints


The host name in non production is: ```http://localhost:3000``` and the base url is ```/api/v1``` 

So in total this becomes: ```http://localhost:3000/api/v1```


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
    "username": "<USERNAME>",
    "affiliation": "<ORGANISATION NAME>"
    "appType": "member" or "systemAdmin"
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

* **POST** -> /organisation

_Example request:_
``` javascript
{
	"name": "butik 1"
}
```

_Example response:_
``` javascript
{
    "status": "ok",
    "msg": "Organisation with id 'e4e2c319-74ee-4dd4-bd70-9a9a0181603b' has been created",
    "organisation": {
        "name": "butik 1",
        "id": "e4e2c319-74ee-4dd4-bd70-9a9a0181603b"
    }
}
```

Be sure to set header _Authorization_ with the value of ```token``` from a systemAdmin login response

* **GET** -> /organisation

add ```?ids=["<ID1>", "<ID2>"]``` to the url
to search for organisations with ids

_Example response:_
``` javascript
{
    "status": "ok",
    "result": [
        {
            "docType": "organisation",
            "id": "592d5fb0-a449-4bff-9bf6-986deca4ab6b",
            "name": "org1"
        },
        {
            "docType": "organisation",
            "id": "e4e2c319-74ee-4dd4-bd70-9a9a0181603b",
            "name": "butik 1"
        }
    ]
}
```

Be sure to set header _Authorization_ with the value of ```token``` from a login response

* **GET** -> /organisation/:id

_Example response:_
``` javascript
{
    "status": "ok",
    "organisation": {
        "docType": "organisation",
        "id": "592d5fb0-a449-4bff-9bf6-986deca4ab6b",
        "name": "org1"
    }
}
```


### Cases

*  **GET** -> /case/:id

_Example response:_
``` javascript
{
    "case": {
        "docType": "case",
        "foodItem": "ae3e359b-3c86-4acd-b3e4-e29487c129c4",
        "id": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
        "state": "open"
    },
    "foodItem": {
        "EANno": "987654321987654321",
        "docType": "foodItem",
        "id": "ae3e359b-3c86-4acd-b3e4-e29487c129c4",
        "name": "fødevare1"
    },
    "parts": [
        {
            "caseId": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
            "docType": "casePart",
            "id": "75b1b156-3785-4ed9-90aa-dc145fb74541",
            "nextParts": [
                "70dda051-6365-453b-b8db-df8a2dc469e2"
            ],
            "owner": "592d5fb0-a449-4bff-9bf6-986deca4ab6b",
            "prevPart": "",
            "state": "seen"
        },
        {
            "caseId": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
            "docType": "casePart",
            "id": "70dda051-6365-453b-b8db-df8a2dc469e2",
            "nextParts": [],
            "owner": "2955c2be-1f6d-49ea-aba9-7e7de1aee468",
            "prevPart": "75b1b156-3785-4ed9-90aa-dc145fb74541",
            "state": "new"
        }
    ]
}
```

Be sure to set header _Authorization_ with the value of ```token``` from a login response

With member token, you will get all cases related to that users organisation

With a systemAdmin token, you will get all case and all caseparts for a complete overview


*  **POST** -> /case

_Example request:_
``` javascript
{
    "foodItem": {
        "name": "<FOODITEM NAME>"
        "EANno": "<FOODITEM_EAN_NUMBER>",
    },
	"case": {
        "state": "open" 
    },
    "casePart":{
        "state": "seen"
        "prevPart": "",
    }
    "nextParts": [
        {
            "owner": "<OrganisationID>",
            "state": "new",
        }
    ]

}
```

_Example response_
``` javascript
{
    "status": "ok",
    "msg": "case with id 'cf7008a0-e663-4041-a417-79517314a9b9' has been created",
    "case": {
        "foodItem": {
            "name": "test item",
            "EANno": "987654321",
            "id": "99f68068-531e-4ac5-921b-c95f7f233a0b"
        },
        "case": {
            "state": "open",
            "foodItem": "99f68068-531e-4ac5-921b-c95f7f233a0b",
            "id": "cf7008a0-e663-4041-a417-79517314a9b9"
        },
        "casePart": {
            "state": "seen",
            "prevPart": "",
            "id": "44bd6f27-4d5a-49c0-9b08-0bd18c558114",
            "caseId": "cf7008a0-e663-4041-a417-79517314a9b9",
            "owner": "1",
            "nextParts": [
                "c826c450-012f-4aa9-a909-f381ff0f6c89"
            ]
        },
        "nextParts": [
            {
                "owner": "123kdk29394",
                "state": "new",
                "id": "c826c450-012f-4aa9-a909-f381ff0f6c89",
                "caseId": "cf7008a0-e663-4041-a417-79517314a9b9",
                "nextParts": [],
                "prevPart": "44bd6f27-4d5a-49c0-9b08-0bd18c558114"
            }
        ]
    }
}
```
Be sure to set header _Authorization_ with the value of ```token``` from a login response from a member

*  **GET** -> /case

returns all cases belonging to the affiliation of the user making the call

_Example response:_
``` javascript
{
    "cases": [
        {
            "case": {
                "docType": "case",
                "foodItem": "ae3e359b-3c86-4acd-b3e4-e29487c129c4",
                "id": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
                "state": "open"
            },
            "foodItem": {
                "EANno": "987654321987654321",
                "docType": "foodItem",
                "id": "ae3e359b-3c86-4acd-b3e4-e29487c129c4",
                "name": "fødevare1"
            },
            "caseParts": [
                {
                    "caseId": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
                    "docType": "casePart",
                    "id": "75b1b156-3785-4ed9-90aa-dc145fb74541",
                    "nextParts": [
                        "70dda051-6365-453b-b8db-df8a2dc469e2"
                    ],
                    "owner": "592d5fb0-a449-4bff-9bf6-986deca4ab6b",
                    "prevPart": "",
                    "state": "seen"
                },
                ...
            ]
        }
    ]
}
```
Be sure to set header _Authorization_ with the value of ```token``` from a login response

With member token, you will get the case and parts related to the token member. This is the part related, and the next parts and previous part

With a systemAdmin token, you will get the case and all caseparts for a complete overview

*  **GET** -> /case/:id/history

returns a history of changes to the case object

_Example response:_
``` javascript
{
    "caseHistory": [
        {
            "case": {
                "docType": "case",
                "id": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
                "foodItem": "ae3e359b-3c86-4acd-b3e4-e29487c129c4",
                "state": "open"
            },
            "timestamp": "1547302957"
        },
        ...
    ]
}
```
Be sure to set header _Authorization_ with the value of ```token``` from a login response

* **PUT** -> /case

_Example request:_
``` javascript
    {  
    	"foodItem": "dc4536f1-ea72-4157-ac1c-2921bde6acf1",
        "id": "31492e02-fd75-43fa-982d-b464b277a0fc",
        "state": "closed"
    }
```

_Example response:_
``` javascript
{
    "status": "ok",
    "msg": "case with id '1dfb9685-58a7-42ed-9e79-698d097a6bef' has been update",
    "case": {
        "foodItem": "ae3e359b-3c86-4acd-b3e4-e29487c129c4",
        "id": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
        "state": "closed"
    }
}
```

Be sure to set header _Authorization_ with the value of ```token``` from a systemAdmin login response


### CaseParts

* **PUT** /casepart

Updates a casepart with new parts and changes to state

_Example request:_
```javascript

    {
    	"casePart": {
            "state": "seen",
            "prevPart": "",
            "id": "60befc24-7531-496d-83a7-e7c9800c5609",
            "caseId": "effb068a-ddd7-49b7-834a-ed10f838be98",
            "owner": "1",
            "nextParts": [
                "3847b76d-17c7-44e0-b307-8fd9e4898ad0"
            ]
        },
        "nextParts": [
            {
                "owner": "dkdsdwl",
                "state": "new",
                "caseId": "effb068a-ddd7-49b7-834a-ed10f838be98",
                "nextParts": [],
                "prevPart": "60befc24-7531-496d-83a7-e7c9800c5609"
            }
        ]
    }
```

_Example response:_
```javascript
{
    "status": "ok",
    "msg": "casepart with id 'undefined' has been updated",
    "case": {
        "casePart": {
            "caseId": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
            "docType": "casePart",
            "id": "70dda051-6365-453b-b8db-df8a2dc469e2",
            "nextParts": [
                "7416fd6e-7f19-4478-a3d6-60778848826c"
            ],
            "owner": "2955c2be-1f6d-49ea-aba9-7e7de1aee468",
            "prevPart": "75b1b156-3785-4ed9-90aa-dc145fb74541",
            "state": "closed"
        },
        "nextParts": [
            {
                "owner": "dkdsdwl",
                "state": "new",
                "caseId": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
                "nextParts": [],
                "prevPart": "70dda051-6365-453b-b8db-df8a2dc469e2",
                "id": "7416fd6e-7f19-4478-a3d6-60778848826c"
            }
        ]
    }
}
```

Be sure to set header _Authorization_ with the value of ```token``` from a login response


* **GET** /casepart/:id/history

shows the history of changes to a casepart

_Example response:_
```javascript
{
    "casePartHistory": [
        {
            "casePart": {
                "docType": "casePart",
                "id": "70dda051-6365-453b-b8db-df8a2dc469e2",
                "caseId": "1dfb9685-58a7-42ed-9e79-698d097a6bef",
                "owner": "2955c2be-1f6d-49ea-aba9-7e7de1aee468",
                "state": "new",
                "prevPart": "75b1b156-3785-4ed9-90aa-dc145fb74541",
                "nextParts": []
            },
            "timestamp": "1547302957"
        },
        ...
    ]
}
```

Be sure to set header _Authorization_ with the value of ```token``` from a login response