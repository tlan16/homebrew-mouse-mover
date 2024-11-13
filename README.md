## Another Mouse mover

Key functionality achieved using [robotjs](https://github.com/octalmage/robotjs).

Because of limited time I have, the release only works on MacOS with node version 22. 

There's plan to bundle for more platforms. 

On the first run on MacOS, you'll likely get prompted to change OS privacy settings. 

### Build

Install [bun](https://bun.sh/) first.

```shell
bun install
bun run build
```

Result binary will be at `dist/amm`

### Run

```shell
dist/amm
```

Show debug logs

```shell
LOG_LEVEL=debug dist/amm
```
