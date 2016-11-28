
module.exports = {

    'database': {
		  user: 'HikeMateAdmin', //env var: PGUSER 
		  database: 'HikeMate', //env var: PGDATABASE 
		  password: 'PRESTRONG', //env var: PGPASSWORD 
		  port: 5432, //env var: PGPORT 
		  max: 10, // max number of clients in the pool 
		  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
		}

};