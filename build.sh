#!/bin/bash
echo "Building javascript files.."
npm run tsc
mkdir public
bash -c "cp -rf ./resources ./build"
bash -c  "cp ./.env ./build"
bash -c "cp -rf ./public ./build"
echo "Build done!"