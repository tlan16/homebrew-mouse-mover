## Another Mouse mover

A cli tool that move the mouse cursor with idle detection.

```text
Usage: amm [-v]
```

On the first run on MacOS, you'll likely get prompted to change OS privacy settings.

> [!NOTE]  
> Only working on Node 22.

Tested on MacBook Pro M1 with MacOS 14.

### Installation

```shell
brew install tlan16/mouse-mover/mouse-mover
```

### Upgrade

I'm not very familiar with Homebrew, so this is more like a hack.

```shell
brew remove mouse-mover || true
brew autoremove
brew cleanup --prune=all
brew install tlan16/mouse-mover/mouse-mover
```

### Uninstall

```shell
brew uninstall tlan16/mouse-mover/mouse-mover
```
