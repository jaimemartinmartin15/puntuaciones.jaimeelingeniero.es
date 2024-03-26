# Puntuaciones

This project is an Angular application deployed in AWS S3 under domain [puntuaciones.jaimeelingeniero.es](https://puntuaciones.jaimeelingeniero.es)

[![Build And Deploy](https://github.com/jaimemartinmartin15/puntuaciones.jaimeelingeniero.es/actions/workflows/build-and-publish.yml/badge.svg)](https://github.com/jaimemartinmartin15/puntuaciones.jaimeelingeniero.es/actions/workflows/build-and-publish.yml)

## Development

Clone the repository:

```text
git clone https://github.com/jaimemartinmartin15/puntuaciones.jaimeelingeniero.es.git
```

Install dependencies:

```text
npm i
```

**Note**: To download certain dependencies (scoped with _@jaimemartinmartin15_) from GPR (GitHub Package Registry), you  require a valid personal access token. If obtaining one is not possible, remove the dependency from the [package.json](./package.json). In this situation, work without creating icons and remove any component or module import that cannot be resolved.

Run the application in **localhost**:

```text
npm start
```

Run the application in **private IP address**:

```text
npm run start:public
```

## Unit testing

To run the unit test in development mode (watch changes and open karma) run:

```text
npm run test
```

To just run the unit test once and exit:

```text
npm run test:ci
```

## E2e tests

To start the e2e test run:

```text
npm run test:e2e
```

The tests have some expect but they also generate [screenshots](./e2e/screenshots/e2e-results/) that are compared to [originals](./e2e/screenshots/originals/).

If you make any changes that impact how the application looks, e2e tests might start failing.

To solve this, you can activate the flag _commitResults_ of `e2e-puppeteer` builder in [angular.json](angular.json). Run the workflow manually in the branch you are working on. Pull the changes and compare yourself the results. Deactivate the flag again in [angular.json](angular.json). Commit the new screenshots and remove the results added in the workflow.

## Deploy

After doing the changes in your branch, increase the [package.json](./package.json) version and then run `npm i` to update the package-lock.json

Update also [CHANGELOG.md](./CHANGELOG.md) file.

Then merge the changes in `main` branch and create a tag with the same version than in the package.json

When pushing the tag to the remote, it will trigger the workflow **build-and-publish.yml** automatically to deploy it.

## Workflows

### build-and-publish.yml

Builds and deploys the application to the server.
