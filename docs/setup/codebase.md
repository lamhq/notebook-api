# Setting up Codebase

Read this if you want to set up your codebase from scratch.

Some libraries or packages in `package.json` will not be listed here, that mean they are optional for the codebase.

## Common Setup

### commitlint

Install and configure [commitlint](https://github.com/conventional-changelog/commitlint#getting-started) checks if your commit messages meet the [conventional commit format](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type).

### git-branch-is

1. Install [git-branch-is](https://www.npmjs.com/package/git-branch-is) for linting current branch name
2. Add a script in `package.json`:

```json
"scripts": {
  "preversion": "git-branch-is -r \"^(feature|fix|hotfix)/[a-z\\-\\d\\.]+$\" && echo Preversion checks passed. Your branch name is correct format.",
}
```

### lint-staged

1. Install [lint-staged](https://github.com/okonet/lint-staged) for running linters against staged git files and don't let 💩 slip into your codebase!
2. Add a section in `package.json`:

```json
"lint-staged": {
  "*.ts": [
    "eslint --fix"
  ]
}
```

### husky

1. Install [husky](https://github.com/typicode/husky) to easily wrangle Git hooks and run scripts at those stages
2. Configure `husky` for:
    - Running **git-branch-is** before commit
    - Running **lint-staged** before commit
    - Running **commitlint** to check commit message
    - Running unit test before push

Add a section in `package.json`:

```json
"husky": {
  "hooks": {
    "pre-commit": "yarn preversion && lint-staged",
    "pre-push": "yarn test",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

## API app

### NestJS

1. Install [NestJS v8](https://docs.nestjs.com/#installation), which also included:
    - TypeScript
    - Jest
    - ESLint
    - Prettier
2. [Enable API doc auto generation](https://docs.nestjs.com/openapi/introduction)
3. Install [Config module](https://docs.nestjs.com/techniques/configuration#configuration)
4. Install [Event Emitter module](https://docs.nestjs.com/techniques/events)
5. Install packages required for [Authentication](https://docs.nestjs.com/security/authentication)
6. Integrate [TypeORM](https://docs.nestjs.com/techniques/database) for MongoDB
7. Install packages required for [validation](https://docs.nestjs.com/techniques/validation) and [seriallization](https://docs.nestjs.com/techniques/serialization)

```sh
yarn add class-validator class-transformer
```
8. [Enable Cookies](https://docs.nestjs.com/techniques/cookies)
9. Install package for [sending email](https://github.com/nest-modules/mailer)
10. Configure ESLint for:
    - TypeScript
    - AirBnb
    - Jest
    - Prettier
10. Configure Jest:

```js
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  testEnvironment: 'node',

  // extra configurations
  preset: 'ts-jest',
  moduleNameMapper: {
    '^src/(.+)': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.{module,entity,dto}.ts',
    '!src/{main,config}.ts',
    '!src/database/**/*.ts',
    '!src/common/constants/*.ts',
  ],
};
```

## React Web app (from scratch)

- [TypeScript v4](https://www.typescriptlang.org/download)
  - [Enable `jsx` with React](https://www.typescriptlang.org/docs/handbook/jsx.html#react-integration)
- [Webpack v5](https://webpack.js.org/guides/installation/) integrated with [TypeScript](https://webpack.js.org/guides/typescript/)
- [Jest v27](https://jestjs.io/docs/getting-started) integrated  with [TypeScript](https://jestjs.io/docs/getting-started#using-typescript)
- [`ts-jest`](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [React Hooks Testing Library](https://react-hooks-testing-library.com/installation)
- [React v17](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658#86d8)
- [Material-UI v4](https://material-ui.com/)
- [Material Icons](https://material-ui.com/components/icons/#material-icons)
- [React Hook Form v7](https://react-hook-form.com/get-started#Quickstart) with [Schema Validation](https://react-hook-form.com/get-started#SchemaValidation)
- [React Router v5](https://reactrouter.com/web/guides/quick-start/installation)
- [Recoil v0.3](https://recoiljs.org/docs/introduction/installation/)
- [Storybook v6](https://storybook.js.org/docs/react/get-started/install)
- ESLint for:
  - TypeScript
  - AirBnb
  - Jest
  - Prettier
  - React
  - React Hook
