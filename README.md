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
npm run test:watch
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

If you make any changes that impact how the application looks, or create new screenshots, e2e tests might start failing.

To solve this follow these steps:

- Run `npm run test:e2e` to generate the _new_ screenshots.
- Move the [new screenshots](./e2e/screenshots/e2e-results) to the [originals](./e2e/screenshots/originals/) folder. If there is an e2e-result image that is not in originals, it will fail and will not push the new images that we need.
- Activate the flag _commitResults_ of `e2e-puppeteer` builder in [angular.json](angular.json).
- Comment the AWS sections in the [workflow](./.github/workflows//build-and-publish.yml) to avoid deploy by mistake.
- Commit the changes and push them to the remote.
- Run the workflow manually in the branch you are working on.
- Pull the changes.
- Remove all [originals](./e2e/screenshots/originals/) screenshots, and paste there the new [e2e-result](./e2e/screenshots/e2e-results) screenshots.
- Compare the git differences.
- Deactive the flag _commitResults_ of `e2e-puppeteer` builder in [angular.json](angular.json).
- Remove _all_ [result screenshots](./e2e/screenshots/e2e-results).
- Uncomment the AWS sections in the [workflow](./.github/workflows//build-and-publish.yml) to avoid deploy by mistake.
- Commit changes.
- Try to deploy again.

## Deploy

After doing the changes in your branch, increase the [package.json](./package.json) version and then run `npm i` to update the package-lock.json

Update also [CHANGELOG.md](./CHANGELOG.md) file.

Then merge the changes in `main` branch and create a tag with the same version than in the package.json

When pushing the tag to the remote, it will trigger the workflow **build-and-publish.yml** automatically to deploy it.

## Workflows

### build-and-publish.yml

Builds and deploys the application to the server.
