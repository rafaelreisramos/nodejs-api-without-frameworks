# Building a complete Node.js WebApi + testing with no frameworks

In this repo you can learn how create a Node.js api without any frameworks. The code here is based on [Eric Wendel youtube channel video](https://youtu.be/xR4D2bp8_S0).

I use the new node test library for unit/e2e tests and assert callTracker to check function calls similar those you can do with jest spyOn.

## Features Checklist + Challenges

- Web API

  - [x] it should have an endpoint for storing heroes' data
  - [x] it should have an endpoint for retrieving heroes' data
  - [x] it should have an endpoint for updating heroes' data
  - [x] it should have an endpoint for deleting heroes' data

- Testing

  - Unit

    - [ ] it should test when the application throws an error
    - [ ] it should test all files on the routes layer
    - [ ] it should test all files on the repositories layer
    - [ ] it should test all files on the factories layer
    - Plus
      - [ ] it should reach 100% code coverage (it's currently not possible to get code coverage metrics using only the native Node.js, see [c8](https://www.npmjs.com/package/c8) for this task)

  - Integration / E2E
    - [x] it should test the endpoint for storing heroes' data
    - [x] it should test the endpoint for retrieving heroes' data
    - [x] it should test the endpoint for updating heroes' data
    - [x] it should test the endpoint for deleting heroes' data
    - [ ] it should test when the application throws an error
