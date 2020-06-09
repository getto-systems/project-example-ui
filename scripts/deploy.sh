#!/bin/sh

deploy_main(){
  local version

  version=$(cat .release-version)

  deploy_build_ui
  deploy_download_docs

  ./scripts/replace-root-path.sh

  aws s3 sync public/dist s3://$AWS_S3_PUBLIC_BUCKET/$version
  aws s3 sync secure/dist s3://$AWS_S3_SECURE_BUCKET/$version
}
deploy_build_ui(){
  npm run build
}
deploy_download_docs(){
  local docs_version

  docs_version=$(
    curl --silent "https://api.github.com/repos/$GITHUB_DOCS_REPO/releases/latest" | \
    grep '"tag_name":' | \
    sed -E 's/.*"([^"]+)".*/\1/' \
  )
  curl -sSL https://github.com/$GITHUB_DOCS_REPO/releases/download/$docs_version/docs.tar.gz -o docs.tar.gz
  tar -xz -f docs.tar.gz
  rm -f docs.tar.gz

  rm public/dist/load.js
}

deploy_main
