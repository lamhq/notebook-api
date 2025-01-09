# Notebook API

## Description

API service for Notebook app.

## Project setup

```bash
pnpm install
```

Copy the file `.env.example` to `.env` and fill in the values:

```bash filename=".env"
# Database URI for connecting to MongoDB
DB_URI='mongodb://*'
```

## Compile and run the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Build your application

```bash
npm run build
```

## Deploy

### Deploy locally

Create a `infra/backend.tfvars` file that contains configuration for Terraform S3 backend:

```hcl filename="infra/backend.tfvars"
region               = "<AWS region>"
workspace_key_prefix = "<project name>"
bucket               = "<s3 bucket for storing Terraform state>"
key                  = "terraform.tfstate"
dynamodb_table       = "<DynamoDB table name to perform state locking>"
```

Create a `infra/input.tfvars` file that contain required input variables:

```hcl filename="params.tfvars"
project               = "<project name>"
aws_region            = "<AWS region>"
tf_backend_policy_arn = "Policy ARN"
github_repo_id        = "github-username/repo-name"
google_client_id      = ""
google_client_secret  = ""
api_env_vars = {
  WEB_URL = ""
  DB_URI  = ""
}
```

- `tf_backend_policy_arn`: ARN of IAM policy for managing Terraform backend resources on AWS
- `github_repo_id`: GitHub reposity that contains project source code

Prepare AWS credentials in the terminal.

Init Terraform working directory:

```shell
cd infra
terraform init -backend-config=backend.tfvars -reconfigure
terraform workspace new dev
terraform workspace select dev
```

Build the source code:

```shell
npm install
npm run build
```

Deploy using Terraform CLI:

```shell
terraform apply -var-file="input.tfvars" --auto-approve
```

Note the following values outputed in the terminal:

- `aws_region`
- `ci_role_arn`

Create an user in Amazon Cognito user pool to enable login feature.

In _Google Cloud Console / Google Auth Platform / Clients_, update **Web client**:

- Add Login Page URI to **Authorized JavaScript origins** section (if you use Cognito domain, the URI will look like this: `https://{domain}.auth.{region}.amazoncognito.com`).
- Add Redirect URL to **Authorized redirect URIs** section. (if you use Cognito domain, the URI will look like this: `https://{domain}.auth.{region}.amazoncognito.com/oauth2/idpresponse`).

In _Google Cloud Console / Google Auth Platform / Branding_, add Login Page Domain to **Authorized domains** section (if you use Cognito domain, the URI will look like this: `{domain}.auth.{region}.amazoncognito.com/oauth2/idpresponse`).

### Deploy using GitHub Actions

You need to deploy the project locally first to create the CI role for GitHub Actions.

Go to repository setting on GitHub:

1. Create new environments: `prod`
2. Add an environment secret `TF_BACKEND_CONFIG` with content from `infra/backend.tfvars`
3. Add an environment secret `TF_INPUT_VARS` with content from `infra/input.tfvars`
4. Add an environment variable `AWS_REGION` with value from `aws_region`
5. Add an environment variable `CI_ROLE_ARN` with value from `ci_role_arn`

To deploy the project, push code to the `main` branch, the Github Action workflow in `.github/workflows/main.yml` will run and deploy the project automatically.

## Access deployed API

After running deploy command, look for the outputed API endpoint in the terminal.

To call the API:

```shell
curl https://thfabm1j3j.execute-api.eu-central-1.amazonaws.com/v1/users
```

Benchmark:

```shell
curl -o /dev/null -s -w "\
Time to resolve domain: %{time_namelookup}\n\
Time to establish connection: %{time_connect}\n\
Time to first byte: %{time_starttransfer}\n\
Total time: %{time_total}\n" https://thfabm1j3j.execute-api.eu-central-1.amazonaws.com/v1/diary/activities
```

## Clean up

```sh
terraform destroy -var-file="input.tfvars" --auto-approve
terraform workspace select default
terraform workspace delete dev
```

## Source code structure

TBC
