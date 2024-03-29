#!/bin/bash
shell_log="/Users/gaoxianghu/temp/log/realmoney_test_shell.log"

sshName=hjdang@111.230.194.84

npm run build:prod
tar cvf dist.tar ./dist
ssh -T $sshName  << 'EOSSH'
    cd ~/hjdang-admin
    rm -rf *
EOSSH

scp ./dist.tar  $sshName":/home/hjdang/hjdang-admin"

ssh -T $sshName  << 'EOSSH'
    cd ~/hjdang-admin
	tar xvf ./dist.tar
	mv ./dist/* .
    echo "finish"

EOSSH
    echo "rummay deployed"
