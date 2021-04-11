# Database Methods

``` python 

import table

#Returns a connection to the database when you provide it the proper file location
conn = table.create_connection("offsetlite.db") 

#Adds a user to the table need the name and email of the user
#Name is not important email must be the email used with all packages
table.add_user(conn,name,email)

#Updates the user's total carbon, total miles, and total packages
#Should use once all the packages have been added to the database
update_user(conn,email)

#Returns a dictionary of the user's data
#The dictionary key values match with the users table fields
# {'id': 1, 'name': x, ...}
get_user(conn, email)

#Returns an array of dictionaries of the user's packages
# The key values of the dictionaries match with the packages table fields. 
get_packages(conn, email)

# Adds a package to the database. Arguments match up with the packages table fields
add_package(conn, email, tracking, weight, length, 
                width, height, volume, origin, ship_date, destination, 
                distance, transportation, carbon)


```


# Database Table Specifications
## Users Table
* id : Unique id - Integer
* name : user's name - Text
* email : user's email - Text
* total_packages : total number of packages recieved - Integer
* total_carbon : total amount of carbon used - Real
* total_miles : total mileage of all packages - Real

## Packages Tables
* id : Unique id - Integer
* email: Email of the user - Text
* user_id : Unique id of the user this package belongs to - Integer
* tracking : Package number of the package - Text
* weight : weight of the package - Real
* length : Length of package - Real
* width : Width of package - Real
* height : Height of package - Real
* volume : volume of the package - Real
* origin : Where the package is being shipped from - Text
* ship_date : When the package was shipped (YYY-MM-DD) - Text
* destination : Where the package is being shipped to - Text
* distance : Distance the package traveled - Real
* transportation : Type of transportation the package is using - Text
* carbon : carbon output of table - Real

