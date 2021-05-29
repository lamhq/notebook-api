# Notebook API

A RESTful API Server for Notebook app.


## Requirements

- Mac OS X, Windows, or Linux
- [Yarn](https://yarnpkg.com/) package + [Node.js](https://nodejs.org/) v8.16.2 or newer
- IDE: VSCode with [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) installed. Or any IDE that support ESLint integration.
- MongoDB 4.4.0


## Technologies used

- Nodejs 12.x
- TypeScript 3.9.x
- NestJS
- Swagger


## Running project locally

1. Install & start MongoDB server
2. Install & start mailhog (Web and API based SMTP testing)
3. Import sample data by running this command (MacOS and Linux only):

```sh
./data/import.sh
```

4. Open terminal and run the following commands:

```sh
yarn start:dev
```


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn start:dev`

Same as `yarn start` but in watch mode.

### `yarn start:prod`

Runs the app in the production mode.

### `yarn test`

Launch unit test runner with coverage information. Minimum coverage threshold is also configured for the test to pass.

### `yarn test:e2e`

Launch end to end test.

### `yarn testw`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `dist` folder.<br />

Your app is ready to be deployed!

### `yarn lint`

Launches the linter that analyzes source code to flag programming errors, bugs.


## Development Workflow

This project use [GitHub flow](https://guides.github.com/introduction/flow/). The following table is the rule of branch name.

| name | description |
| :--- | :--- |
| master | production branch, master branch is always deployable. |
| feature/{name} | this branch is derived from master. use it when you develop a new function. |
| fix/{name} | this branch is derived from a master branch. use it when you fix bug. |
| hotfix/{name} | this branch is derived from a release tag. use it when you fix urgent bugs for a version. |

Your branch name is automatically checked when committing by [git-branch-is](https://github.com/kevinoid/git-branch-is).

Here's a typical workflow when working on a ticket

1. Make sure to create a branch and a pull request **before starting development**.

```sh
git checkout -b feature/prepare-code-base
npm run preversion # check your branch name is correct format.
git commit --allow-empty -m "chore: setup env be"
```

2. Create a pull request in bitbucket, please prepend `[WIP]` to your pull request's title.
3. Start development of your task. Update the PR every day.
4. When you finish the task, remove `[WIP]` from the pull request's title, assign it to reviewer.


## Standard

### Code Style

- [TypeScript Style Guide](https://basarat.gitbook.io/typescript/styleguide) + [Airbnb Style Guide](https://github.com/airbnb/javascript).
- Code will be checked by linter (ESLint) before committing.
- Code pushing will be checked by unit test locally before transferring to remote repository. Unit test also has to pass test coverage minimum threshold defined in `jest.config.js` to ensure effective unit test.

### Commit message

- Commit message has to follow [conventional commit](https://conventionalcommits.org/) format.


### Branch name

- Check **Development Workflow** secion.


### File/directory name

- Use this format: `directory-name/file-name.{type}.ts`. `{type}` is type of the exported class (service, module, controller, guard, ...)
- Use `export` instead of `export default`.

**Bad**
```
SuperUsers/UserRole.ts
```

**Good**
```
super-user/user-role.service.ts
```

Reference:

- https://stackoverflow.com/questions/61666498/file-naming-in-nest-js


### MongoDB collection and field naming

- Collection name: use plural, camel case, no hyphens or underscores between words.
- Field name: use camel case.

**Bad**
```
customer-accounts.firstname
```

**Good**
```
customerAccounts.firstName
```

Reference:

- https://stackoverflow.com/questions/9868323/is-there-a-convention-to-name-collection-in-mongodb


### API design

Based on [PageDuty API](https://developer.pagerduty.com/docs/rest-api-v2/rest-api/), excepts:

- API version is specified in the URI, instead of header. Ex: http://domain/api/v1/*

- The API `GET /resources` return an array of resource, the total number of records (without pagination) will be defined in response header `X-Total-Count`:

```json
[
  {
    // fields appear here
    "field1": "abc",
    "field2": 123
  }
]
```
- The API `GET /resources/:id` return a single resource:

```json
{
  // fields appear here
  "field1": "abc",
  "field2": 123
}
```

- Query string will use camel case instead of separated by underscore. Ex: http://domain/api/v1/products?sortBy=name

- API route will be prefixed with module name. Ex: http://domain/api/v1/catalog/products (`catalog` is the module name)

- In case the API request is unsuccessful due to input validation error, The **error details** in response body will be an object with key name is name of invalid input field and value is error reason:

```json
{
  "error": {
    "message": "Error Message String",
    "code": "ERROR_CODE",
    "details": {
      "name": "REQUIRED",
      "email": "INVALID_EMAIL",
      // ...other fields
    }
  }
}
```

- Access Token should be sent in the request as part of an `Authorization` header, using this format:

```
Authorization: Bearer {token-string}
```


## Release and deploy

Api's version is stored in `package.json`. The version number is updated automatically every time a new release is created. To create a new release and deploy to **test** environment automatically, run this command:

```sh
yarn release
```

## Deploy manually

To deploy api service to any environments, follow this [guide](https://support.atlassian.com/bitbucket-cloud/docs/pipeline-triggers/#Run-pipelines-steps-manually), the pipeline to run are `deploy-to-test`, `deploy-to-production`.