#!/bin/sh

today=$(date '+%Y%m%d%H%M%S')
curDir=$(cd `dirname $0`; pwd)
echo "huicang/front:$today"
echo $curDir

buildClient() {
    npm run build
    npmRes=$(echo $?)
    if [ $npmRes -gt 0 ]; then
        echo "\033[31m npm build error, check the error code up! \033[0m"
        exit;
    fi
    docker build -t huicang/front:$today .
    res=$(echo $?)
    if [ $res -gt 0 ]; then
        echo "\033[31m docker build error, check the error code up! \033[0m"
        exit;
    fi

    echo "\033[32m docker build finish! \033[0m"
    echo "\033[32m docker image name: huicang/front:$today \033[0m"
}

buildClient;
