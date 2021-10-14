#!/usr/bin/env bash
#
# Release a Node package. 

# @author: Daniel Souza <me@posix.dev.br>
# @license: MIT

# Text Decorators
reset="\e[0m"
strong="\e[1;39m"
red="\e[1;31m"
yellow="\e[1;33m"
green="\e[1;32m"
blue="\e[1;34m"

# Strict Mode
# exit when a command has a non-zero exit status
set -e

# check number of args
if [ "$#" -ne 1 ]; then
  printf "${red}ERROR:${reset} %s\n" "Illegal number of parameters"
fi

# Main
printf "${blue}NOTICE:${reset} %s\n" "Building assets..." 
npm run build && git add "dist/" && git commit -m "Build distributables for v${1}"

printf "${blue}NOTICE:${reset} %s\n" "Versioning to v${1}"
npm version "$1"

printf "${blue}NOTICE:${reset} %s\n" "Pushing v${1} to Git repository"
git push && git push origin "v${1}"

printf "${blue}NOTICE:${reset} %s\n" "Publishing v${1} to NPM repository"
npm publish

printf "${green}DONE:${reset} %s\n" "Release v${1}" 
