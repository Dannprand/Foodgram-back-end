### Create Post

POST /posts/create

- Request
    - Header
        
        With authentication token
        
    - Body
        
        ```json
        {
        	"title": "Test Title",
        	"image": File,
        	"caption": "Test Caption",
        	"tags": ["1", "2"]
        }
        ```
        
- Response
    
    ```json
    {
        "status": 201,
        "message": "OK",
        "data": {
            "post_id": 5,
            "title": "Test Title",
            "caption": "Test Caption",
            "image_url": "public/images/1735191586827-500124531.jpeg",
            "user_id": 1
        }
    }
    ```
    

### Get List Post (FYP)

GET /posts

- Request
    - Header
        
        With authentication token
        
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK",
        "data": [
            {
                "post_id": 1,
                "title": "Test Title",
                "caption": "Test Caption",
                "image_url": "public/images/1735191316458-524931592.jpeg",
                "user": {
    		            "user_id": 1,
                    "username": "admin user",
                    "profile_image": "public/images/1735191164756-205240208.png"
                },
                "tags": [],
                "ratingValue": 7,
                "ratingCount": 2,
                "commentCount": 1,
                "like": 1,
                "is_current_user_liked": true,
                "is_current_user_rated": false
            },
            {
                "post_id": 2,
                "title": "Test Title",
                "caption": "Test Caption",
                "image_url": "public/images/1735191390047-961271299.jpeg",
                "user": {
    		            "user_id": 1,
                    "username": "admin user",
                    "profile_image": "public/images/1735191164756-205240208.png"
                },
                "tags": [],
                "ratingValue": 0,
                "ratingCount": 0,
                "commentCount": 0,
                "like": 1,
                "is_current_user_liked": true,
                "is_current_user_rated": false
            }
        ]
    }
    ```
    

### Get Post Detail

GET /posts/:post_id

- Request
    - Header
        
        With authentication token
        
    - Parameter
        
        post_id: String
        
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK",
        "data": {
            "post_id": 1,
            "title": "Test Title",
            "caption": "Test Caption",
            "image_url": "public/images/1735191316458-524931592.jpeg",
            "user": {
    		        "user_id": 1,
                "username": "admin user",
                "profile_image": "public/images/1735191164756-205240208.png"
            },
            "tags": [],
            "ratingValue": 7,
            "ratingCount": 2,
            "commentCount": 1,
            "like": 1,
            "is_current_user_liked": true,
            "is_current_user_rated": false
        }
    }
    ```
    

### Get List Post by User Id

GET /users/:user_id/posts

- Request
    - Header
        
        With authentication token
        
    - Parameter
        - user_id: String
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK",
        "data": [
            {
                "post_id": 1,
                "image_url": "public/images/1735191316458-524931592.jpeg"
            },
            {
                "post_id": 2,
                "image_url": "public/images/1735191390047-961271299.jpeg"
            }
        ]
    }
    ```
    

### Like post

GET /posts/:post_id/likes

- Request
    - Header
        
        With authentication token
        
    - Parameter
        - post_id: String
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK"
    }
    ```
    

### Unlike post

GET /posts/:post_id/likes/delete

- Request
    - Header
        
        With authentication token
        
    - Parameter
        - post_id: String
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK"
    }
    ```
    

### Rating post

POST /posts/:post_id/ratings

- Request
    - Header
        
        With authentication token
        
    - Parameter
        - post_id: String
    - Body
        
        ```json
        {
        	"rating": 5
        }
        ```
        
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK"
    }
    ```
    

### Unrating post

POST /posts/:post_id/ratings/delete

- Request
    - Header
        
        With authentication token
        
    - Parameter
        - post_id: String
    - Body
        
        ```json
        {
        	"rating": 5
        }
        ```
        
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK"
    }
    ```
    

### Comment post

POST /posts/:post_id/comments

- Request
    - Header
        
        With authentication token
        
    - Parameter
        - post_id: String
    - Body
        
        ```json
        {
        	"content": "Test Comment"
        }
        ```
        
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK"
    }
    ```
    

### Get all comments by post id

GET /posts/:post_id/comments

- Request
    - Header
        
        With authentication token
        
    - Parameter
        - post_id: String
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK",
        "data": [
            {
                "comment_id": 1,
                "user": {
                    "username": "liefran",
                    "profile_image": "http://localhost:3000/images/user.png"
                },
                "content": "Test Comment"
            }
        ]
    }
    ```
    

### Filter post by tag

GET /tags/:tag_id/posts

- Request
    - Header
        
        With authentication token
        
    - Parameter
        - tag_id: String
- Response
    
    ```json
    {
        "status": 200,
        "message": "OK",
        "data": [
            {
                "post_id": 5,
                "title": "Test Title",
                "caption": "Test Caption",
                "image_url": "public/images/1735191586827-500124531.jpeg",
                "user": {
    		            "user_id": 1,
                    "username": "admin user",
                    "profile_image": "public/images/1735191164756-205240208.png"
                },
                "tags": [
                    {
                        "tag_id": 8,
                        "name": "Sweet"
                    },
                    {
                        "tag_id": 9,
                        "name": "Savoury"
                    }
                ],
                "ratingValue": 0,
                "ratingCount": 0,
                "commentCount": 0,
                "like": 0,
                "is_current_user_liked": true,
    		        "is_current_user_rated": false
            }
        ]
    }
    ```