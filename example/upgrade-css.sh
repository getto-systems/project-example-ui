#!/bin/sh

version=2.25.0
find $APP_ROOT/storybook/ -name '*.html' | xargs sed -i "s|[^/]*/getto.css|${version}/getto.css|"
find $APP_ROOT/example/public/ -name '*.html' | xargs sed -i "s|[^/]*/getto.css|${version}/getto.css|"
