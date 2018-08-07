Database setup:

Import database "resources/contactms.sql" to the mysql server.
======================================================================================================
Server setup:

1. Go to "server" directory.
2. Run "npm install" command.
3. Configure "server/dbConfig/dbConfig.json" with the database credential.
4. Run "npm start" command to run the server at port 3000 (configurable at "server/bin/www").
======================================================================================================
Client setup:

1. Go to "client" directory.
2. Run "npm install" command.
3. Run "bower install" command.
4. Run "grunt serve" command to up the UI (proxy is already set in gruntFile to point bakend at 3000).
======================================================================================================

We are ready to go...Best of luck.

