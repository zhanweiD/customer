#!/usr/bin/expect
# 发布 开发包
# eg ./publish.sh 112 xin@2018
set timeout 30
set addr [lindex $argv 0]
set password [lindex $argv 1]

set package_name "customer"
# set default_addr "112"
set default_dir "/opt/workspace/front"
set default_user "deploy"
# set default_pwd "xin@2018"
set default_server "192.168.90."


spawn scp tgz/${package_name}.tgz $default_user@$default_server$addr:$default_dir

expect {
  "*assword:"
  {
    send "$password\n"
  }
} 
expect "100%"
expect eof

spawn ssh $default_user@$default_server$addr

expect {
  "*password:"
  {
    send "$password\n"
  }
} 

expect {
  "$*" 
  {
    send "cd $default_dir\n"
    send "tar -zxvf ${package_name}.tgz\n"
    send "exit\r"
  }
}

interact
