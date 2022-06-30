#!/bin/bash
shell_log="/Users/gaoxianghu/temp/log/realmoney_test_shell.log"

sshName=hjdang@42.192.51.99

npm run build:prod
tar cvf dist.tar ./dist
scp ./dist.tar  $sshName":/home/hjdang/hjdang-admin"

ssh -T $sshName  << 'EOSSH'
    cd ~/hjdang-admin
	tar xvf ./dist.tar
	mv ./dist/* .
    echo "finish"

EOSSH
    echo "rummay deployed"
