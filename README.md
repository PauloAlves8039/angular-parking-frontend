<h1 align="center">Parking - Frontend</h1>

<p align="center">
  <a href="https://angular.io/"><img alt="Angular" src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white" /></a>
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
-  `Modular Architecture`
- `API ViaCEP`
- `JWT`
- `Image Canva`

## :floppy_disk: Clone Repository

```bash
git clone https://github.com/PauloAlves8039/angular-parking-frontend.git
```
## :camera: Screenshots

- `Application`
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot1.png" /></p>
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot2.png" /></p>
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot3.png" /></p>

- `Ticket`
<p align="center"> <img src="https://github.com/PauloAlves8039/angular-parking-frontend/blob/master/src/assets/images/screenshot4.png" /></p>

## :boy: Author

<a href="https://github.com/PauloAlves8039"><img src="https://avatars.githubusercontent.com/u/57012714?v=4" width=70></a>
[Paulo Alves](https://github.com/PauloAlves8039)
