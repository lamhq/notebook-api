# Setting up local development environment

- Operating System: macOS
- IDE: [Visual Studio Code](https://go.microsoft.com/fwlink/?LinkID=534106)
- Node.js 14.17.3, install via [NVM](https://github.com/nvm-sh/nvm)
- Yarn, install via [npm](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- Git & SSH key
- Database server (API development only): [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x-tarball/)
- Mail server (API development only): [MailHog](https://github.com/mailhog/MailHog#installation)

## SSH config for Git

To use custom SSH key when cloning source codes, open you ssh config file (`~/.ssh/config`) and edit it as below:

```
Host github.com
	IdentityFile ~/keys/id_rsa

Host bitbucket.org-lam
	IdentityFile ~/keys/id_rsa_lam
```