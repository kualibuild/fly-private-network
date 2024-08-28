# Fly Private Network PoC

## Setup

In a terminal from the `./server` directory:

```sh
fly launch --no-deploy
# change whatever settings you'd like
# You'll need to delete the `[http_service]` section that got added to the `fly.toml`
fly ips allocate-v6 --private # allocate a private ip so that .flycast addresses work
fly deploy
```

Now in a terminal from the './client` directory:

```sh
fly launch --no-deploy
# Change whatever settings you'd like
# You'll need to delete the `[http_service]` section that got added to the `fly.toml`
# Change the `FLYCAST_ORIGIN` to point at `http://{server-app-name}.flycast` where
# `{server-app-name}` is the name of the app for the server app.
fly ips allocate-v6 --private # allocate a private ip so that public ips don't get generated
fly deploy
```
