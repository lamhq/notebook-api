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
DB_URI='mongodb://localhost:27017/test'
```

## Run the project

Start Mongo database server:

```bash
podman run --rm -p 27017:27017 mongo:8.0.4-noble
```

Start the app:

```bash
# development mode
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

## Create infrastructure

1. Set up AWS credentials for the command line
2. Prepare Terraform configuration files
3. Init Terraform working directory
4. Create deployment package
5. Create the infrastructure
6. Create a user in Cognito user pool
7. Set up Google authentication
8. Get API token using Postman
9. Access the deployed API using API token

### Prepare Terraform configuration files

Create a `infra/backend.tfvars` file that contains configuration for Terraform S3 backend:

```hcl filename="infra/backend.tfvars"
region               = "<AWS region>"
workspace_key_prefix = "<project name>"
bucket               = "<s3 bucket for storing Terraform state>"
key                  = "api.tfstate"
dynamodb_table       = "<DynamoDB table name to perform state locking>"
```

Create a `infra/params.tfvars` file that contain required variables to deploy the infrastructure:

```hcl filename="params.tfvars"
project                  = "<PROJECT>-<APP>"
aws_region               = ""
web_url                  = "http://localhost:3001"
google_client_id         = ""
google_client_secret     = ""
github_repo_id           = "username/repo"
github_oidc_provider_arn = ""
tf_backend_policy_arn    = ""
api_env_vars = {
  DB_URI = ""
}
```

- `tf_backend_policy_arn`: ARN of IAM policy for managing Terraform backend resources on AWS
- `github_repo_id`: GitHub reposity that contains project source code
- `github_oidc_provider_arn`: ARN of Identity provider for Github Action
- `web_url`: URL of the web app

### Init Terraform working directory

```shell
cd infra
terraform init -backend-config=backend.tfvars -reconfigure
```

If you're deploying to non-production environment (e.g. dev), run these commands:

```shell
terraform workspace new dev
terraform workspace select dev
```

### Create deployment package

```shell
pnpm install
pnpm run build
```

### Create the infrastructure

This will create the infrastructure and deploy the code to AWS:

```shell
terraform apply -var-file="params.tfvars" --auto-approve
```

### Create a user in Cognito user pool

Since the application's user pools doesn't support registration, you'll have to manually add a user with a google email to login.

Sign in to [Amazon Cognito console](https://console.aws.amazon.com/cognito), select the user pool to add a user.

### Set up Google authentication

The application only support sign in through Google, so
you have to configure Google OAuth client to work with the Cognito user pool.

In _Google Cloud Console / APIs & Services / OAuth consent screen / Clients_, select **Web client**:

- Add Login Page URI to **Authorized JavaScript origins** section (if you use Cognito domain, the URI will look like this: `https://{domain}.auth.{region}.amazoncognito.com`).
- Add Redirect URL to **Authorized redirect URIs** section. (if you use Cognito domain, the URI will look like this: `https://{domain}.auth.{region}.amazoncognito.com/oauth2/idpresponse`).

In _Branding_, add Login Page Domain to **Authorized domains** section (if you use Cognito domain, the URI will look like this: `{domain}.auth.{region}.amazoncognito.com`).

### Get API token using Postman

1. Open Postman, create a new HTTP request
2. In **Authorization** tab, select **OAuth 2.0** for **Auth Type**
3. In Configure New Token section, fill in:
   1. Token Name: _choose any name you want_
   2. Grant type: `Authorization Code`
   3. Callback URL: `http://localhost:3030/auth/callback`
   4. Auth URL: `https://{domain}.auth.{region}.amazoncognito.com/oauth2/authorize`
   5. Access Token URL: `https://{domain}.auth.{region}.amazoncognito.com/oauth2/token`
   6. Client ID: Client ID of Cognito App client
   7. Client Secret: Client secret of Cognito App client
   8. Scope: `openid email profile`
   9. Click button `Get New Access Token`

### Access the deployed API using API token

1. Set request's URL to `https://{api-id}.execute-api.{region}.amazonaws.com/v1/diary/tags` to test
2. In **Authorization** tab, select the token you created in the previous step
3. Set `Use Token Type` to `ID token`
4. Set `Header Prefix` to `Bearer`
5. Click button `Send` to send the request

## Continuous Delivery

1. Create an environment for deployment in your repository settings
2. Create Secrets and Variables for the environment
3. When changes are pushed to the `main` branch, a Github Action workflow in `.github/workflows/main.yml` will run and deploy the application automatically.

Go to repository setting on GitHub:

1. Create new environments: `prod`
2. Add an environment secret `TF_BACKEND_CONFIG` with content from `infra/backend.tfvars`
3. Add an environment secret `TF_VARS` with content from `infra/params.tfvars`
4. Add an environment variable `AWS_REGION` with value from `aws_region`
5. Add an environment variable `CD_ROLE_ARN` with value from `CD_ROLE_ARN`

## Access deployed API

After running deploy command, look for the outputed API endpoint in the terminal.

To call the API:

```shell
curl https://thfabm1j3j.execute-api.eu-central-1.amazonaws.com/v1/users
```

## Clean up

```sh
terraform destroy -var-file="params.tfvars" --auto-approve
terraform workspace select default
terraform workspace delete dev
```

## Source code structure

TBC
