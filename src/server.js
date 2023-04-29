require("express-async-errors");
const AppError = require("./utils/AppError");

const express = require('express');
const routes = require('./routes');


const app = express()

app.use(express.json());
app.use(routes);

app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({status: "error",
  message: error.message})
  }
  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })

  console.log(error);
})
const port = 3333
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`app on url http://localhost:${port}`)
})