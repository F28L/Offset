## Contributors
Sandeep Ramesh- I designed the backend of the project, specifically dealing with the Gmail API and setting up the 0Auth2 Flow, querying the emails, and parsing them for tracking numbers.

Lucas Stuart- I designed the logo and color palette, then worked on the backend. I wrote the part that calculated carbon output given an origin and destination, and also contributed on the tracking API implementation.

Thomas Varano- I designed the backend and coordinated to combine all the work my collaborators did into one cohesive project. I also wrote the front end and connected the two.

Thomas Giewont- I designed the SQL database. I wrote multiple different methods involving SQL queries so that the other team members can easily access and modify the database.

## Inspiration
Every day, Amazon ships over a 1.6million packages a day, and this number is only rising. We use services like Amazon and other delivery services, ignoring the impact they have on the environment. We wanted to help society realize its true carbon footprint by showing them its shopping carbon footprint.

## What it does
Offset looks through your email history in search of tracking numbers and package verification emails. With this data, Offset then calculates the carbon cost of each shipment and provides a myriad of data points about the user's shopping history.

## How we built it
Offset is a web application whose front end was written in HTML, the backend was written in Python and SQL, and running on Flask.

We leveraged the Gmail API within Google Cloud to access the user's email data and then used the ShipEngine API to gather critical data about the package. This data is then inputted into an SQL database that is registered to the user.

## Challenges we ran into
We ran into a few challenges regarding the APIs and the ETL of the data. ETL, Extract, Transform, and Load, was difficult as the APIs return objects and data structures were very different from each other and we had to do minor processing to make them work together. 
We also ran into a problems with the ShipEngine API not working according to its API documentation. For example, you might notice that the package weights and sizes are hardcoded. This is because we built the database to have these columns, but the ShipEngine API did not appropriately return these values for the tracking numbers, even though the API said it would. Unfortunately, even UPS did not provide this data on their website, so we could not scrape it. We ran out of time to correct this issue in the database. 

COVID19 (See accomplishments)

## Accomplishments that we're proud of
It works! This was the first hackathon for 3 of our team members and we got a project working! 2 of us currently have COVID19 and 1 of us is concussed, but we were able to power through and still complete this project.

## What we learned
How to interact with APIs and build a SQL Database. We also learned how to use Flask and how to connect a front end to a back end effectively.

## What's next for Offset
We want to find a better API than ShipEngine to get better package data. We also want to add better resources to truly offset our carbon footprint. The main goal was to redirect the user to pages that allowed the user to buy trees that would be planted, but we were unable to add this to the website in time.


## Links
[Demo](https://www.youtube.com/watch?v=6jMwL1DJUro)
[DevPost](https://devpost.com/software/offset-fqmtug)
