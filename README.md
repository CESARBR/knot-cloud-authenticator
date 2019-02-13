# knot-cloud-authenticator

KNoT Cloud authenticator service. Provides the API for clients to create and exchange user credentials for access tokens.

## Installation and usage

This service is part of the KNoT Cloud and requires a [Mailgun](http://mailgun.com/) account for sending e-mails.

### Bootstrap

This service requires a special device to have been created in the KNoT Cloud prior to its execution, step that is performed by the [bootstrap service](https://github.com/CESARBR/knot-cloud-bootstrap).

Follow the steps described in its repository to setup and run the boostrap. The `authenticator` object returned will be used in the configuration of this service.

### Configuration

Either create a [configuration file](https://github.com/lorenwest/node-config/wiki/Configuration-Files) in the `config` (`./config/local.json` is ignored by Git in this repository) or use environment variables to configure your installation. In case you are running the published Docker image, you'll need to stick with the environment variables.

The configuration parameters are the following (the environment variable name is in parenthesis):

* `server`
  * `port` (`PORT`) **Number** Server port number. (Default: 80)
  * `resetSenderAddress` (`RESET_SENDER_ADDRESS`) **String** The address of the sender of the reset password e-mail.
  * `resetUri` (`RESET_URI`) **String** URI of the reset password page that will be sent to the user making the reset request.
* `authenticator`
  * `uuid` (`AUTHENTICATOR_UUID`) **String** Authenticator device UUID, created in the bootstrap step.
  * `token` (`AUTHENTICATOR_TOKEN`) **String** Authenticator device token, created in the bootstrap step.
* `meshblu`
  * `protocol` (`MESHBLU_PROTOCOL`) **String** Meshblu HTTP adapter protocol, either **http** or **https** (Default: **http**).
  * `hostname` (`MESHBLU_HOSTNAME`) **String** Meshblu HTTP adapter hostname.
  * `port` (`MESHBLU_PORT`) **Number** Meshblu HTTP adapter port.
* `mailgun`
  * `apiKey` (`MAILGUN_API_KEY`) **String** Mailgun API key.
  * `domain` (`MAILGUN_DOMAIN`) **String** Mailgun domain.
* `logger`
  * `level` (`LOGGER_LEVEL`) **String** Logger level, one of: **error**, **warn**, **info**, **verbose**, **debug**, **silly**. (Default: **info**)

### Build and run (local)

First, install the dependencies:

```
npm install --production
```

Then:

```
npm run build
npm start
```

### Build and run (local, development)

First, install the dependencies:

```
npm install
```

Then, start the server with auto-reload:

```
npm run start:watch
```

or, start the server in debug mode:

```
npm run start:debug
```

### Build and run (Docker, development)

A development container is specified at `Dockerfile-dev`. To use it, execute the following steps:

1. Build the image:

    ```
    docker build . -f Dockerfile-dev -t knot-cloud-authenticator-dev
    ```

1. Create a file containining the configuration as environment variables.
1. Run the container:

    ```
    docker run --env-file authenticator.env -p 4000:80 -v `pwd`:/usr/src/app -ti knot-cloud-authenticator-dev
    ```

The first argument to `-v` must be the root of this repository, so if you are running from another folder, replace `` `pwd` `` with the corresponding path.

This will start the server with auto-reload.

### Run (Docker)

Containers built from the master branch and the published tags in this repository are available on [DockerHub](https://hub.docker.com/r/cesarbr/knot-cloud-authenticator/).

1. Create a file containining the configuration as environment variables.
1. Run the container:

```
docker run --env-file authenticator.env -p 4000:80 -ti cesarbr/knot-cloud-authenticator
```

### Verify

To verify if the service is running properly, execute:

```
curl http://<hostname>:<port>/healthcheck
```
