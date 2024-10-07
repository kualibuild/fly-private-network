# Fly Private Network PoC

## Setup

In a terminal from the `./server` directory:

```sh
fly launch --copy-config --no-deploy --no-public-ips
git restore fly.toml # undo changes made by fly cli
fly ips allocate-v6 --private # allocate a private ip so that .flycast addresses work
fly deploy
```

Now in a terminal from the './client` directory:

```sh
fly launch --copy-config --no-deploy --no-public-ips
git restore fly.toml # undo changes made by fly cli
# Change the `FLYCAST_ORIGIN` to point at `http://{server-app-name}.flycast` where
# `{server-app-name}` is the name of the app for the server app.
fly ips allocate-v6 --private # allocate a private ip so that public ips don't get generated
fly deploy --ha=false
fly logs
```
