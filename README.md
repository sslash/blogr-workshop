![alt text](https://github.com/dniel/blogr-workshop/blob/master/screenshot.png)


## Get started
* clone repo
* cd into blogr-workshop
* install postgres and latest version of node.js
* npm install
* create the SQL database: run `cat sql/create_db.sql | psql` in the terminal
* create SQL tables: run `cat sql/posts.sql | psql -d blogr` in the terminal
* start the server, run `npm run dev:server`
* start the frontend, run `npm run dev:frontend`
* If you see `Bloggr is running on port 3000 ` and `Postgres is running!` in the terminal the app is up and running and you are ready for the workshop.

## Notes
* the application should be implemented using the Flux architecture, http://facebook.github.io/flux/
* use bootstrap for layout and styling, http://getbootstrap.com/javascript/
* bootstrap tutorial, http://www.w3schools.com/bootstrap/default.asp
* use EcmaScript6 features, http://es6-features.org/
* https://madebymany.com/blog/beyond-the-to-do-app-writing-complex-applications-using-flux-react-js
* testing should be done with mocha and chai

## Todo
* add a master-detail example implementation.
* add integration tests
* add unit tests
* add mock data for frontend running without backend
* how to do page transitions and navigation
* better errorhandling, logging of errors to remote api etc.
* dao operations should use prepared statements and named parameters.
