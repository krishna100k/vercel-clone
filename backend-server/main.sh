#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

git clone "GIT_REPOSITROY_URL" /home/app/output

exec node script.js