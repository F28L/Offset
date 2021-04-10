## Users Table
* id : Unique id
* name : user's name
* email : user's email
* total_packages : total number of packages recieved
* total_carbon : total amount of carbon used
* total_miles : total mileage of all packages

## Packages Tables
* id : Unique id
* email: Email of the user
* user_id : Unique id of the user this package belongs to
* tracking : Tracking number of the package
* weight : weight of the package
* length : Length of package
* width : Width of package
* height : Height of package  
* volume : volume of the package
* origin : Where the package is being shipped from
* ship_date : When the package was shipped (YYY-MM-DD)
* destination : Where the package is being shipped to
* distance : Distance the package traveled
* transportation : Type of transportation the package is using (road, plane, etc)
* carbon : carbon output of table

