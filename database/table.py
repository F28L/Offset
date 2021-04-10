import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)
    return conn

def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def main():
    database = "offsetlite.db"

    #Holds users email, # of packages, total amount of carbon, and total mileage of packages
    user_table = """ CREATE TABLE IF NOT EXISTS users (
                                        id integer PRIMARY KEY,
                                        name text,
                                        email text,
                                        total_packages integer,
                                        total_carbon real,
                                        total_miles real
                                    ); """
    #Every package has its tracking number, weight, volume, origin(ship from address), 
    # date of shipment, destination(ship to address), transportation( Type of shipment road, air,etc), calculated carbon  
    package_table = """ CREATE TABLE IF NOT EXISTS packages (
                                        id integer PRIMARY KEY,
                                        user_id integer,
                                        tracking integer,
                                        weight real,
                                        weight_unit text,
                                        dimension_unit,
                                        length real,
                                        width real,
                                        height real,
                                        volume real,
                                        origin text,
                                        ship_date text,
                                        destination text,
                                        transportation text,
                                        carbon real,
                                        FOREIGN KEY (user_id) REFERENCES users (id)
                                    ); """

    conn = create_connection(database)
    if conn is not None:
        create_table(conn, user_table)
        create_table(conn, package_table)
    else:
        print("You fucked up")

if __name__ == '__main__':
    main()
    