#!bash
# stop service
/usr/sbin/service node-app stop --force

# update prev and latest links.
realpath /opt/blogr/prev | xargs rm -rf
rm /opt/blogr/prev
mv /opt/blogr/latest /opt/blogr/prev
ln -s "$(pwd)" /opt/blogr/latest

# start service again
/usr/sbin/service node-app start --force &> /dev/null
