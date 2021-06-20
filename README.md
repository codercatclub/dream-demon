# ECS for ThreeJS

To get started look at `index.ts` and `examples` folder. To run the app `yarn start`

To access examples go to `localhost:3000/examples.html`

# Basic concepts

- Everything belong to the `World`.
- World contains `Entities` and `Systems`
- Entity just an ID and list of associated `Components`
- Components has no logic, only data
- Components has to be serializable
- Systems update on components that they get through queries
- Systems effectively contain all game logic
