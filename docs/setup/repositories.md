# Setting up repositories on GitHub

## API Repository

1. Create a GitHub repository for storing code of API app
2. Push code to repository under branch `master`
3. [Update repository's settings](https://docs.github.com/en/github/administering-a-repository/managing-branches-in-your-repository/changing-the-default-branch) as follow:

## `Branches` setting

Default branch: `master`

Branch protection rules:

- `master`:
  - Branch name pattern: `master`
  - **Require status checks to pass before merging**
  - **Require branches to be up to date before merging**
  - Status checks that are required:
    - `Unit Test`
    - `Lint`
  - **Include administrators**

## `Environments` setting

- `test`:
  - Required reviewers: *enter email or github account name*
  - Deployment branches: **Protected branches**
  - Environment secrets:
    - `PROJECT_ID`: your [Google Cloud Project ID](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
    - `SERVICE_ACCOUNT_KEY`: [Google Service Account Key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys) in JSON format
- `prod`:
  - same as `test` environment but replace **Environment secrets** with values for production environment.


## Web Repository

1. Create a GitHub repository for storing code of Web app
2. Push code to repository under branch `master`
3. [Update repository's settings](https://docs.github.com/en/github/administering-a-repository/managing-branches-in-your-repository/changing-the-default-branch) as follow:

## `Branches` setting

Same as API repository, but doesn't have `Unit Test` status check


## `Environments` setting

Same as API repository, but has an additional environment for previewing:

- `preview`:
  - Required reviewers: *empty*
  - Deployment branches: **All branches**
  - Environment secrets: same as `test` environment