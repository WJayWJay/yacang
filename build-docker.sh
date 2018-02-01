#!/bin/sh

today=$(date '+%Y%m%d%H%M%S')
curDir=$(cd `dirname $0`; pwd)
echo "huicang/front:$today"
echo $curDir

checkEnv() {
    echo "please use node version > 7.0"
    nodeVersion=$(node -v)
    echo "your node version is: $nodeVersion!"
    isMatch=$(echo $nodeVersion | grep "^v\(\d\+\.\)\+\d\+\$")
    if [ $isMatch ]; then
        isMatch=$(echo $isMatch | tr -d "v")
        isMatch=$(echo $isMatch | tr -d ".")
        echo $isMatch
        len=$(echo ${#isMatch})
        baseV="700"
        echo  $len,${#baseV};
        if [ $len -gt ${#baseV} ]; then
            baseV="7000"
        fi
        if [ "$isMatch" -le "$baseV" ]; then
            echo "033[31m your node version is too lower, we may need node version lower than v7.0.0, but you give is $nodeVersion \033[0m"
            exit;
        fi
    else
        echo "033[31m node maybe not exists, please check your node! \033[0m";
        exit;
    fi
}

function buildClient() {
    npm run build
    docker build -t huicang/front:$today .
    res=$(echo $?)
    if [ $res -gt 0 ]; then
        echo "\033[31m docker build error, check the error code up! \033[0m"
        exit;
    fi

    echo "\033[32m docker build finish! \033[0m"
    echo "\033[32m docker image name: huicang/front:$today \033[0m"
}
checkEnv;
buildClient;
