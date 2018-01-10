# sakishiraz
Sakishiraz Official Website http://sakishiraz.com

## Setting up the devlopment environment

The commands below creates docker containers, tmux session. It also starts `webpack-dev-server` opening a new browser tab.
URL: https://sakishiraz.dev:8000

```
make dev
```

If you haven't created a docker network named `sakishiraz-proxy`, then create it. and run `make dev` again.
```
docker create network sakishiraz-proxy
make dev
```

## Editing Content

All contents are retrived from `data.js` or `data.development.js` according to your environment.
After editing the content, you have to rebuild the source with the following command.

```
yarn run build
```

## Build and deployment for production

Make sure your content in `data.js` is right before you build and deploy.
Then run the command below.

```
yarn run build:prod
```

Then open `Transmit` app, select `sakishiraz.com`.
Replace all contents with the files and folders in `dist`.
