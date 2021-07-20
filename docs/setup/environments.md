# Setting up Runtime Environment

## Setting up Google Cloud project

1. [Create a firebase project](https://firebase.google.com/docs/web/setup#create-firebase-project) (save Project ID for later use)
2. [Enable billing for project](https://cloud.google.com/billing/docs/how-to/modify-project#enable_billing_for_an_existing_project)
3. [Enable the Container Registry API](https://cloud.google.com/container-registry/docs/quickstart#before-you-begin)
4. [Enable Enable the Cloud Run API](https://cloud.google.com/run/docs/setup)
5. [Enable the Secret Manager API](https://cloud.google.com/secret-manager/docs/configuring-secret-manager)
6. [Allowing Cloud Run service account to access secrets](https://cloud.google.com/run/docs/configuring/secrets#access-secret) (choose account with name **Default compute service account**)
7. [Create a service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating) for deployment with Github Actions
8. To be able to deploy to [Firebase](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md) and [Cloud Run](https://github.com/google-github-actions/setup-gcloud/blob/master/example-workflows/cloud-run/README.md), assign the following roles to service account:
    - Firebase Authentication Admin
    - Firebase Hosting Admin
    - Service Account User
    - Cloud Run Admin
    - Cloud Run Viewer
    - API Keys Viewer
    - Storage Admin
9. [Create and download service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys) to your computer
10. Create secrets (for environment variables to use with API app):

- `DB_URI`: MongoDB connection string
- `WEB_URL`: the url of the deployed web app (ex: `https://abc.com`)
- `SMTP_USER`: [SMTP credential](https://help.mailgun.com/hc/en-us/articles/203380100-Where-Can-I-Find-My-API-Key-and-SMTP-Credentials-)
- `SMTP_PWD`: [SMTP credential](https://help.mailgun.com/hc/en-us/articles/203380100-Where-Can-I-Find-My-API-Key-and-SMTP-Credentials-)

Use this command to create those secrets via command line:

```sh
printf <SECRET_VALUE> | gcloud secrets create <SECRET_NAME> --data-file=- --replication-policy=user-managed --locations=<REGION>
```
Replace the following values:

- `SECRET_NAME`: secret name
- `SECRET_VALUE`: secret value
- `REGION`: can be found [here](https://cloud.google.com/run/docs/locations)


## Setting up Github Environment

Create the following secrets in your GitHub Environment (`test` or `prod`):

- `PROJECT_ID`: the Firebase Project ID you created in **Step 1**
- `SERVICE_ACCOUNT_KEY`: the Service Account Key you downloaded **Step 9**