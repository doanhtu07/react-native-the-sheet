#!/bin/bash

set -e

# clean each workspace package
pnpm -r exec rm -rf node_modules

# clean root
rm -rf node_modules
rm -f pnpm-lock.yaml

# clean Expo cache
rm -rf apps/example-expo/.expo