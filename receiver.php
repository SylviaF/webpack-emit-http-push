<?php

// ！！！！ 注意 ！！！！
// 此代码存在很大的安全隐患，请不要部署到线上服务。
// 百度内部请使用：http://agroup.baidu.com/fis/md/article/196978

// 如果是 debug 模式,就输出所有错误
if(isset($_GET['debug']) && $_GET['debug'] == "true"){
    @error_reporting(E_ALL);
    ini_set('display_errors', '1');
}else{
    @error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
}

function mkdirs($path, $mod = 0777) {
    if (is_dir($path)) {
        return chmod($path, $mod);
    } else {
        $old = umask(0);
        if(mkdir($path, $mod, true) && is_dir($path)){
            umask($old);
            return true;
        } else {
            umask($old);
        }
    }
    return false;
}

// if($_POST['to'] && isset($_POST['token']) && $_POST['token'] == "xxxxxx"){ // 以增加 token 字段为例, 举一反三
if($_POST['to']){
    $to = urldecode($_POST['to']);

    // 最好对路径进行一些限制，避免覆盖到其他
    // if (substr($to, 0, 21) !== '/home/XXXX/') {
    //     header("Status: 500 Internal Server Error");
    // }
    if(is_dir($to) || $_FILES["file"]["error"] > 0){
        header("Status: 500 Internal Server Error");
    } else {
        if(file_exists($to)){
            unlink($to);
        } else {
            $dir = dirname($to);
            if(!file_exists($dir)){
                mkdirs($dir);
            }
        }
        echo move_uploaded_file($_FILES["file"]["tmp_name"], $to) ? 0 : 1;
    }
} else {
    echo 'I\'m ready for that, you know.';
}
