# Deploy

Follow these steps to deploy to Test or Production environment:

1. Make changes on `master` branch (via merging pull requests)
2. Go to [workflow run history](https://docs.github.com/en/actions/managing-workflow-runs/viewing-workflow-run-history) page
3. From the list of workflow runs, click the name of the latest run that has the word *"Deploy"* in description
4. Click [Review deployments](https://docs.github.com/en/actions/managing-workflow-runs/reviewing-deployments#approving-or-rejecting-a-job), choose the job environment(s) (`prod` or `test`) to approve deployment
