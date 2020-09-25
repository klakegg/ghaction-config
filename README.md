# Load config (GitHub Action)

Simple action for reading configuration provided as JSON or YAML and make it available as outputs for later use in the workflow.


## Example

Configuration (JSON):

```json
{
  "version": "1.0"
}
```

Configuration (YAML):

```yaml
version: 1.0
```

Workflow definition:


```yaml
name: Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Load configuration
        id: config
        uses: klakegg/ghaction-config@master
        with:
          path: config.yaml

      - name: Verify
        env:
          VERSION: ${{ steps.config.outputs.version }}
        run: echo $VERSION
```