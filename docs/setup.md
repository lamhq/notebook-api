# Setup production environment

## Checklist

- [ ] [Create a Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project)
- [ ] [Enable billing for project](https://cloud.google.com/billing/docs/how-to/modify-project#enable_billing_for_an_existing_project)
- [ ] [Create a Firebase project from an existing Google Cloud project](https://firebase.google.com/docs/web/setup)
- [ ] [Enable the Container Registry API](https://cloud.google.com/container-registry/docs/quickstart#before-you-begin)
- [ ] [Enable Enable the Cloud Run API](https://cloud.google.com/run/docs/setup)
- [ ] [Enable the Secret Manager API](https://cloud.google.com/secret-manager/docs/configuring-secret-manager)
- [ ] [Create secrets for api service](https://cloud.google.com/sdk/gcloud/reference/secrets/create) in [Secret Manager](https://console.cloud.google.com/security/secret-manager) page in Cloud Console
  - [ ] DB_URI
  - [ ] WEB_URL
  - [ ] SMTP_USER
  - [ ] SMTP_PWD
- [ ] Create service account for [Firebase](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md) and [Cloud Run](https://github.com/google-github-actions/setup-gcloud/blob/master/example-workflows/cloud-run/README.md) deployment via Github Actions
- [ ] [Allowing Cloud Run to access secrets](https://cloud.google.com/run/docs/configuring/secrets#access-secret)
- [ ] [Create Environment and Environment secrets in Github workflow](https://docs.github.com/en/actions/reference/environments#creating-an-environment)
  - [ ] PROJECT_ID
  - [ ] SERVICE_ACCOUNT_KEY