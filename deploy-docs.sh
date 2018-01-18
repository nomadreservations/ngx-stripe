#!/bin/sh
STATUS="$(git status -s)"
RED='\033[0;31m'
NC='\033[0m' # No Color

if [[ -z "${STATUS// }" ]]
then
    mkdir -p demo/dist/api
    cp -r documentation/* demo/dist/api
    sed -i "" 's/base href="\/"/base href="\/ngx-stripe\/"/' ./demo/dist/index.html
    sed -i "" '/\/dist/d' ./demo/.gitignore
    git add .
    git commit -m "Edit .gitignore to publish"
    git push origin `git subtree split --prefix demo/dist master`:gh-pages --force
    git reset HEAD~
    git checkout demo/.gitignore
else
    printf "${RED}ERROR:${NC} Need clean working directory to publish\n"
fi
