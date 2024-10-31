<h1 align="center">:parking: Parking - Frontend</h1>

<p align="center">
  <a href="https://angular.io/"><img alt="Angular" src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" /></a>
  <a href="https://www.npmjs.com/"><img alt="NPM" src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" /></a>
  <a href="https://nodejs.org/en"><img alt="Node JS" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" /></a>
  <a href="https://www.docker.com/"><img alt="Docker" src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" /></a>
</p>

## :computer: Project

This project simulates a small `parking` management system, this application was developed for academic purposes.

## :blue_book: Business Rule

- `Customer registration`: on the first visit, the customer is asked to register by providing personal details. 

- `Entry to Parking Lot`: to store the vehicle in the parking lot, a `ticket` is issued with the vehicle's `permanence` data, informing the customer of the `entry date`, `license plate` and `references`.

- `Ticket Delivered to Customer`: most of the fields are filled in when the stay is opened, the fields for `date of exit` and `total value` are left open, while the `stay status` field receives the value `parked` indicating that the vehicle is in the parking lot.

- `Vehicle pickup`: the customer presents the `ticket` given at the opening of the stay for the `pickup` procedure, this value is changed to the `stay status` field, at this stage the `date of departure` and `total amount` fields are recorded with their values informing the `date and time` and the `total amount` of the vehicle's stay in the parking lot.  

## :hammer: Features

`Operations`: for all entities in the application, you can perform basic operations such as `listing`, `searching all records`, `searching for individual records`, `creating`, `updating`, and `deleting`.

`Security`: new `Users` can be registered, and processes for `Authentication` and `Authorization` of these users are implemented.

That application is connected to the API: [Parking Backend](https://github.com/PauloAlves8039/dotnet-parking-backend/tree/master)

## ✔️ Resources Used

- `Angular CLI v.17.3.8`
- `Node v.20.11`
- `Bootstrap v.5.0.2`
- `Bootstrap Icons`
- `Modular Architecture`
- `API ViaCEP`
- `JWT`
- `Image Canva`
- `Animate.css`
- `Docker`

## :white_check_mark: Technical Decisions

- `Modular Architecture`: I chose to maintain this architecture to create a structure that supports the addition of new features..

- `Adding Docker`: The goal is to enable the application to be used in different environments.

## :floppy_disk: Clone Repository

```bash
git clone https://github.com/PauloAlves8039/angular-parking-frontend.git
```

## :arrow_down: How to Use

### Using Your Operating System:

- Open the terminal and navigate to the `src` folder, then run the command `npm install` to install the application modules.

- Once the previous step is completed, execute the command `ng s -o`  to start the application.

- The application will automatically open at: http://localhost:4200/

### Using Docker:

- Navigate to the root of the project and run the command `docker-compose up` to create the application `container` and `image` in the `Docker` environment. 

- After creating the environment navigate to: `http://localhost:4201 `

## :camera: Screenshots

- `Application`
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot1.png" /></p>
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot2.png" /></p>
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot3.png" /></p>
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot4.png" /></p>

- `Ticket`
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot5.png" /></p>

## :boy: Author

<a href="https://github.com/PauloAlves8039"><img src="https://avatars.githubusercontent.com/u/57012714?v=4" width=70></a>
[Paulo Alves](https://github.com/PauloAlves8039)
