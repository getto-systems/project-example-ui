#!/bin/bash

replace_root_path_main(){
  local version
  local file

  version=$(cat .release-version)

  for file in $(find */dist -name '*.html'); do
    if [ -f "$file" ]; then
      sed -i -e "s|/dist/|/$version/|g" "$file"
    fi
  done
}

replace_root_path_main
