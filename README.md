# 🍷 Winzer

## Winzer connects wine enthusiasts with farmers through their events, promoting a social and human alternative to buying their wine third party. 

## Description

Create and costomize your profile to upload and/or participate in events. Use geo-location to find your position or search directly via leaflet-geo-search. If you like an event, you can join it and check out the party. If you decide to host, there are plenty of options to advertize your event. Chose a position on the map, title, description, a header image and a time frame. The events are also displayed on the profiles, so you know, if your favorite host has currently more events planned.


## Functionalities

- A landing page with a map, filled with dynamic event-markers.
- User Registration, Login. Logout, user Edit.
- Event upload with images and text.
- Event participation and manual deletion option for the host.
- Customizable profile pages, that display the users activities.

## Technologies

- Next.js
- TypeScript
- JavaScript
- PostgreSQL
- playwright E2E tests
- FIGMA https://www.figma.com/file/D5MASQAAnqATj34yv7PAMN/Winzer?node-id=0-1&t=L5jAt6Tp3pVQ9NQy-0
- DrawSQL https://drawsql.app/teams/patrikn/diagrams/winzer

## Setup instructions

- Clone the repository with `git clone <repo>`
- Setup the database by downloading and installing PostgreSQL
- Create a user and a database
- Create a new file `.env`
- Copy the environment variables from `.env-example` into `.env`
- Replace the placeholders xxxxx with your username, password and name of database
- Install dotenv-cli with `yarn add dotenv-cli`
- Run `yarn install` in your command line
- Run the migrations with `yarn migrate up`
- Start the server by running `yarn dev`
