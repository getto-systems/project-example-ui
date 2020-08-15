#!/bin/sh

deploy_main(){
  local version

  deploy_build_ui

  version=$(cat .release-version)

  deploy_rewrite_version
  deploy_sync_contents
}
deploy_build_ui(){
  npm run build
}
deploy_rewrite_version(){
  for file in $(find */dist -name '*.html'); do
    if [ -f "$file" ]; then
      sed -i -e "s|/dist/|/$version/|g" "$file"
    fi
  done
}
deploy_sync_contents(){
  aws s3 sync public/dist s3://$AWS_S3_PUBLIC_BUCKET/$version
  aws s3 sync secure/dist s3://$AWS_S3_SECURE_BUCKET/$version
}

deploy_main
