 ## API Documentation - Endpoints

### Member Token:
Basic eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiOTE2NjQ1YzktNTJjOC00NmEwLWE4Y2UtMzY1ZTlkM2E2YTNmIiwidXNlcm5hbWUiOiJtZW1iZXIxMCIsIm9yZ2FuaXNhdGlvbiI6eyJpZCI6IjEiLCJuYW1lIjoic2hvcCJ9LCJhZmZpbGlhdGlvbiI6eyJpZCI6IjEiLCJuYW1lIjoic2hvcCJ9LCJhcHBUeXBlIjoibWVtYmVyIn0sImlhdCI6MTU0NzExMDgwMiwiZXhwIjoxNTUzMTU4ODAyfQ.hb_HGwiTnTJYw7pJ_i3ufsAhTuRB2jTE3Mx_2KyBbXw


### System admin token
Basic eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZWVkNGQwZmMtNjZhMi00OWFmLWEyYjMtYzY2YmFjNGQ2YWQzIiwidXNlcm5hbWUiOiJzeXNhZG1pbiIsIm9yZ2FuaXNhdGlvbiI6eyJpZCI6Ii0xIiwibmFtZSI6Im5vbmUifSwiYWZmaWxpYXRpb24iOnsiaWQiOiItMSIsIm5hbWUiOiJub25lIn0sImFwcFR5cGUiOiJzeXN0ZW1BZG1pbiJ9LCJpYXQiOjE1NDcxMTI5MzAsImV4cCI6MTU1MzE2MDkzMH0.-7THclCGX0GDU-k3dPdeeU1bLeTNpE64Ii_Ft62IMnQ


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


### Cases

*  **GET** -> /case/:id

_Example response:_
``` javascript
{
    "cases": [
        {
            "case": {
                "docType": "case",
                "foodItem": "ac0c24b7-8ab5-4df4-b979-a143dd292e53",
                "id": "28f19e08-be73-41f6-ac8e-17fdd7c8e1b7",
                "state": "open"
            },
            "casePart": [
                {
                    "caseId": "28f19e08-be73-41f6-ac8e-17fdd7c8e1b7",
                    "docType": "casePart",
                    "id": "713fb6da-9935-462f-a418-4f4928eecb6c",
                    "nextParts": [
                        "43952372-8c7b-4e56-abab-5b400a8ed9ef"
                    ],
                    "owner": "1",
                    "prevPart": "",
                    "state": "seen"
                }
            ]
        },
        ...
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

*  **GET** -> /case/<CASE_ID>

_Example response:_
``` javascript
{
    "case": {
        "docType": "case",
        "foodItem": "dc4536f1-ea72-4157-ac1c-2921bde6acf1",
        "id": "31492e02-fd75-43fa-982d-b464b277a0fc",
        "state": "open"
    },
    "foodItem": {
        "EANno": "987654321",
        "docType": "foodItem",
        "id": "dc4536f1-ea72-4157-ac1c-2921bde6acf1",
        "name": "test item"
    },
    "parts": [
        {
            "caseId": "31492e02-fd75-43fa-982d-b464b277a0fc",
            "docType": "casePart",
            "id": "6388a524-5e6a-4128-bf83-fc777799598f",
            "nextParts": [],
            "owner": "123kdk29394",
            "prevPart": "da04f2b5-9ace-425b-b637-44b2cc8fd990",
            "state": "new"
        },
        {
            "caseId": "31492e02-fd75-43fa-982d-b464b277a0fc",
            "docType": "casePart",
            "id": "da04f2b5-9ace-425b-b637-44b2cc8fd990",
            "nextParts": [
                "6388a524-5e6a-4128-bf83-fc777799598f"
            ],
            "owner": "1",
            "prevPart": "",
            "state": "seen"
        }
    ]
}
```
Be sure to set header _Authorization_ with the value of ```token``` from a login response

With member token, you will get the case and parts related to the token member. This is the part related, and the next parts and previous part

With a systemAdmin token, you will get the case and all caseparts for a complete overview