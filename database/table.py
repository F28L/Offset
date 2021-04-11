import sqlite3
import json
from sqlite3 import Error

def open_connection(): 
    return create_connection('offsetlite.db')

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)
    return conn

def clear(conn):
    try:
        c = conn.cursor()
        c.execute("DROP TABLE users")
        c.execute("DROP TABLE packages")
    except Error as e:
        print(e)

def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def add_user(conn, name, email):
    try:
        c = conn.cursor()
        values = (name, email)
        sql = ''' INSERT INTO users(name,email) VALUES(?,?) '''
        c.execute(sql,values)
        conn.commit()
    except Error as e:
        print(e)

def update_user(conn, email):
    try:
        c = conn.cursor()
        values = (email,)
        sql = '''UPDATE users SET total_carbon = (SELECT SUM(carbon) FROM packages WHERE email = ? ) '''
        sql2 = '''UPDATE users SET total_miles = (SELECT SUM(distance) FROM packages WHERE email = ? ) '''
        sql3 = '''UPDATE users SET total_packages = (SELECT COUNT(carbon) FROM packages WHERE email = ? )'''
        c.execute(sql,values)
        c.execute(sql2,values)
        c.execute(sql3,values)
        conn.commit()
    except Error as e:
        print(e)

def get_user(conn, email):
    try:
        c = conn.cursor()
        values = (email,)
        sql = ''' SELECT * FROM users where email = ?'''
        c.execute(sql,values)
        data = c.fetchall()
        names = list(map(lambda x: x[0], c.description))
        dic = {names[i]: data[0][i] for i in range(len(names))}
        return dic
    except Error as e:
        print(e)

def get_packages(conn, email):
    try:
        c = conn.cursor()
        values = (email,)
        sql = ''' SELECT * FROM packages where email = ?'''
        c.execute(sql,values)
        data = c.fetchall()
        names = list(map(lambda x: x[0], c.description))
        ret = []
        for x in range(len(data)):
            dic = {names[i]: data[x][i] for i in range(len(names))}
            ret.append(dic)
        return ret
    except Error as e:
        print(e)

def add_package(conn, email, tracking, weight, length, 
                width, height, volume, origin, ship_date, destination, 
                distance, transportation, carbon):
    try:
        c = conn.cursor()
        values = (email,)
        sql = ''' SELECT id FROM users where email = ?'''
        c.execute(sql,values)
        key = c.fetchall()
        values = (email, key[0][0], tracking, weight, length, 
                width, height, volume, origin, ship_date, destination, 
                distance, transportation, carbon)
        sql = ''' INSERT INTO packages(email,user_id,tracking,weight,
                length,width,height,volume, origin, ship_date, destination, 
                distance, transportation, carbon) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) '''
        c.execute(sql,values)
        conn.commit()
    except Error as e:
        print(e)

### Not Important ###

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
                                        email text,
                                        user_id integer,
                                        tracking text,
                                        weight real,
                                        length real,
                                        width real,
                                        height real,
                                        volume real,
                                        origin text,
                                        ship_date text,
                                        destination text,
                                        distance real,
                                        transportation text,
                                        carbon real,
                                        FOREIGN KEY (user_id) REFERENCES users (id)
                                    ); """

    conn = create_connection(database)
    if conn is not None:
        create_table(conn, user_table)
        create_table(conn, package_table)
    else:
        print("You messed up")

if __name__ == '__main__':
    main()
    