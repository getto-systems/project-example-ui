#!/bin/sh

if [ -z "$APP_ROOT" ]; then
    APP_ROOT=.
fi

ext='.theme-backup'

version=2.34.0
find $APP_ROOT/public -name '*.html' | xargs sed -i$ext "s|[^/]*/getto.css|${version}/getto.css|"
find $APP_ROOT/storybook -name '*.html' | xargs sed -i$ext "s|[^/]*/getto.css|${version}/getto.css|"

title="GETTO Example"
find $APP_ROOT/public -name '*.html' | xargs sed -i$ext "s|<title>.*</title>|<title>${title}</title>|"

find $APP_ROOT -name '*.html'$ext | xargs rm
