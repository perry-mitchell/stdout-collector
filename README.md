# stdout collector
> Collect and route stdout between computers and terminals

[![Build Status](https://travis-ci.org/perry-mitchell/stdout-collector.svg?branch=master)](https://travis-ci.org/perry-mitchell/stdout-collector)

![2 terminals into 1](https://raw.githubusercontent.com/perry-mitchell/stdout-collector/master/stdout-collector.jpg)

## About
Having applications running in many terminals and machines can be troublesome to monitor. Setting up log sending/fetching may be a bit too tedious a task for some projects. `stdout-collector` provides an intermediate solution by allowing for easy redirection of application `stdout` streams to one destination.

Using this application it is possible to route the `stdout` from many different applications on different machines to one terminal on another. This library provides 2 commands:

 * `stdsend` - Send `stdout` to a destination receiver
 * `stdrecv` - Receive `stdout` from another machine (or several machines)

## Usage
To set up a receiver:

```shell
stdrecv
```

This executes the receiving server application which listens for clients.

To set up a sending utility:

```shell
./some-program-with-output.sh | stdsend 192.168.0.1 --name="MyApp"
```

### stdrecv arguments
The follow arguments can be provided to `stdrecv`:

| Argument                | Required | Description                                      |
|-------------------------|----------|--------------------------------------------------|
| `--port=`               | No       | Override the listen port. Default: `8888`.       |

### stdsend arguments
The follow arguments can be provided to `stdsend`:

| Argument                | Required | Description                                      |
|-------------------------|----------|--------------------------------------------------|
| (address/addresses)     | Yes      | Destination addresses, including port if not the default. Multiple addresses separated by a space. |
| `--name=`               | No       | Set the client name. For display, max 5 characters (trimmed otherwise). |

#### Destination addresses
You can specify 1 or more destination addresses. All of the following are valid:

 * `192.168.0.1` (port: `8888`)
 * `localhost:3333`
 * `http://server.com` (port: `8888`)

## Potential issues
Some CLI apps do funny things to their output in terms of buffering. Some times you can get around this by using `stdbuf`. For example, some cryptocurrency miners don't buffer by line, which can be fixed by running:

```shell
stdbuf -oL -eL ./miner | stdsend 192.168.0.100 --name="Rig01"
```
