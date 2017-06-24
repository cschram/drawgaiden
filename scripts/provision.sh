#!/usr/bin/env bash

# Add RethinkDB repository
source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -

# Update packages and install dependencies
apt-get update
apt-get upgrade -y
apt-get install -y build-essential python g++ libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev rethinkdb

# Configure RethinkDB
cp /etc/rethinkdb/default.conf.sample /etc/rethinkdb/instances.d/instance1.conf
service rethinkdb restart

# Install Node
wget -q https://nodejs.org/dist/v8.1.2/node-v8.1.2-linux-x64.tar.xz
tar -xf node-v8.1.2-linux-x64.tar.xz
cp -R node-v8.1.2-linux-x64/bin/* /usr/local/bin/
cp -R node-v8.1.2-linux-x64/include/* /usr/local/include/
cp -R node-v8.1.2-linux-x64/lib/* /usr/local/lib/
cp -R node-v8.1.2-linux-x64/share/* /usr/local/share/