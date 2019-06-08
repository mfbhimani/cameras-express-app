# ExpressJS Application of Cameras

This application is built using ExpressJS and stores a list of cameras in a local JSON file. There are a couple of routes setup on the application to retrieve and display info about the cameras, create and store info about new cameras to the JSON file.

To access the application, user needs to register an account using /register route. To login to the application, user would use /login route. More details about the routes are specified below.

- GET  /camera : get list of cameras
- GET  /camera/id : get a camera by id eg. /camera/2
- POST /camera : create a camera
- PUT  /camera/id  : update an existing camera by id eg. /camera/3
- DELETE /camera/id : delete an existing camera by id eg. /camera/4
- GET /register : obtains username and password from user and adds entry to JSON file
- GET /login : obtains username and password from user to login to the application

