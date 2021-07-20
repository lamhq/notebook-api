# Setting up Codebase

Read this if you want to set up your codebase from scratch.

## Common Setup

- Install [commitlint](https://github.com/conventional-changelog/commitlint) for linting commit message
- Install [git-branch-is](https://www.npmjs.com/package/git-branch-is) for linting current branch name
- Install [lint-staged](https://github.com/okonet/lint-staged) for running linters against staged git files and don't let 💩 slip into your codebase!
- Install [husky](https://github.com/typicode/husky) to easily wrangle Git hooks and run scripts at those stages
- Configure `git-branch-is`
- Configure `lint-staged`
- Configure `commitlint`
- Configure `husky` for:
  - Running **git-branch-is** before commit
  - Running **lint-staged** before commit
  - Running **commitlint** to check commit message
  - Running unit test before push

## Setting up codebase for API app

- Install [NestJS](https://docs.nestjs.com/#installation), which also included:
  - TypeScript
  - Prettier
  - Jest
  - ESLint
- Configure ESLint for:
  - TypeScript
  - AirBnb
  - Jest
  - Prettier
  - React
  - React Hook
- Configure Jest:

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

## Setting up codebase for React Web app

- React
- Storybook
- ESLint for:
  - TypeScript
  - AirBnb
  - Jest
  - Prettier
  - React
  - React Hook


