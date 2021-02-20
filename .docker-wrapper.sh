DOCKER_WRAPPER_IMAGE_node(){ head -1 $APP_ROOT/.gitlab-ci.yml | sed "s/.*node:\(.*\)/\1/"; }
DOCKER_WRAPPER_IMAGE_debian(){ echo "buster"; }

DOCKER_WRAPPER_APP(){
  case $1 in
    *start)
      node-run npm run setup
      ;;
  esac
  npm-server http-public $1 npm run start:public
  npm-server http-secure $1 npm run start:secure
}
DOCKER_WRAPPER_SERVER_OPTS_http(){ echo "-p ${LABO_PORT_PREFIX}${PUBLIC_PORT}:${PUBLIC_APP_PORT} -p ${LABO_PORT_PREFIX}${SECURE_PORT}:${SECURE_APP_PORT}"; }
