### Register

POST /register

- Request
    
    ```json
    {
        "username": "goldwin",
        "email": "goldwin@gmail.com",
        "password": "goldwin1234"
    }
    ```
    
- Response
    
    ```json
    {
        "status": 201,
        "message": "OK",
        "data": {
            "user_id": 1,
            "token": "8004b1d0b3b54c4093bf7a4c1924b9d5"
        }
    }
    ```
    

### Login

POST /login

- Request
    ```json
    {
        "username": "goldwin",
        "password": "goldwin1234"
    }
    ```
    
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK",
        "data": {
            "user_id": 1,
            "token": "b04d462b955a4fe39412ca9b0d2569ef"
        }
    }
    ```
    

### Get User

GET /users/:user_id

- Request
    - Header
        - Bearer Token
    - Parameter
        - user_id: String
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK",
        "data": {
            "username": "goldwin",
            "profile_image": "public/images/1735191164756-205240208.png"
        }
    }
    ```
    

### Update User

PATCH /users/:user_id/update

- Request
    - Header
        
        - Bearer Token
        
    - Parameter
        - user_id: String
    - Body
        
        ```json
        {
        	"username" : "goldwin"
        	"profile_image" : File
        }
        ```
        
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK",
        "data": {
            "username": "goldwin",
            "profile_image": "public/images/1735210709522-969351302.png"
        }
    }
    ```