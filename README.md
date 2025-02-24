# Pond-2 Project

This project is a simple application built using PIXI.js that demonstrates the creation and animation of various objects on the screen, including circles, fish, food, and rocks.

## Project Structure

```
Pond-2
├── .babelrc              # Babel configuration file
├── .gitignore            # Git ignore file
├── package.json          # npm configuration file
├── public
│   └── index.html        # HTML file for the application
├── README.md             # Project documentation
├── src
│   ├── index.js          # Main entry point of the application
│   └── objects
│       ├── Circle.js     # Circle class definition
│       ├── Fish.js       # Fish class definition
│       ├── Food.js       # Food class definition
│       └── Rock.js       # Rock class definition
└── webpack.config.js     # Webpack configuration file
```

## Description

- **src/index.js**: This file initializes a PIXI application, creates various objects (circles, fish, food, and rocks), and sets up an animation loop to update their positions on the screen.

- **src/objects/Circle.js**: This file exports a `Circle` class that represents a circle object in the PIXI application. It includes properties for the circle's radius, color, graphical representation, and its velocity in both x and y directions. The class also has methods for initializing the circle and updating its position.

- **src/objects/Fish.js**: This file exports a `Fish` class that represents a fish object in the PIXI application. It includes properties for the fish's size, color, graphical representation, and its velocity in both x and y directions. The class also has methods for initializing the fish, updating its position, and interacting with food.

- **src/objects/Food.js**: This file exports a `Food` class that represents a food object in the PIXI application. It includes properties for the food's size, color, graphical representation, and its lifetime. The class also has methods for initializing the food, updating its size, and destroying it after its lifetime.

- **src/objects/Rock.js**: This file exports a `Rock` class that represents a rock object in the PIXI application. It includes properties for the rock's size, color, and graphical representation. The class also has methods for initializing the rock and drawing its shape.

## Installation

To install the necessary dependencies, run:

```sh
npm install
```

## Usage

To start the application in development mode, run:

```sh
npm start
```

This will launch the PIXI application in your default web browser. You should see various objects (circles, fish, food, and rocks) animated on the screen.

## Build

To create a bundled version of the application for production, run:

```sh
npm run build
```

This will create a `docs` folder containing the bundled application.

## Deployment

To deploy the application to GitHub Pages:

1. Commit and push your changes to the `main` branch.
2. Go to the repository settings on GitHub.
3. Under the "Pages" section, set the source to the `main` branch and the folder to `/docs`.

Your application will be available at `https://<your-username>.github.io/<your-repository-name>/`.
