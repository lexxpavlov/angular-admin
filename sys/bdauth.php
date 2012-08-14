<?php
defined('DEVELOPMODE') &&
define ('DEVELOPMODE', !strpos(HOST,'.')?1:0); // Develop-mode, extended error logging

require_once "DbSimple/Connect.php";

$dbcfg = array(
	'type'=>'mysql',
	'host'=>'localhost',
	'port'=>'3306',
	'database'=>'ng_test',
	'user'=>'root',
	'password'=>'',
	'prefix'=>'',
	'logging'=>DEVELOPMODE,
);
$db = new DbSimple_Connect("$dbcfg[type]://$dbcfg[user]:$dbcfg[password]@$dbcfg[host]:$dbcfg[port]/$dbcfg[database]");
if ($dbcfg['prefix']) $db->setIdentPrefix($dbcfg['prefix']);
$db->setErrorHandler('databaseErrorHandler');
if ($dbcfg['logging']) $db->setLogger('db_var_logger');
unset($dbcfg);

function databaseErrorHandler($message, $info) {
  if (!error_reporting()) return;
	file_put_contents(FILEROOT.'log/mysql.log', date("Y-m-d H:i:s")." $message\n\n", FILE_APPEND);
  if (!DEVELOPMODE) {
    header("HTTP/1.1 404 Not Found");
    die(file_get_contents(FILEROOT.'404.html'));
  }
  echo "<b>SQL Error</b>: $message<br>";
}

function db_echo_logger($db, $sql, $caller) {
  if (!error_reporting()) return;
  if ($caller) echo print_r($sql,1)." -- at $caller[file] line $caller[line]";
  echo print_r($sql,1)."<br>\n";
}
function db_var_logger($db, $sql, $caller) {
  global $db_log_string;
  if (!error_reporting()) return;
  if ($caller) $db_log_string .= print_r($sql,1)." -- at $caller[file] line $caller[line]\n";
    else $db_log_string .= print_r($sql,1)."\n";
}
function db_array_logger($db, $sql, $caller) {
  global $db_log_array;
  if (!error_reporting()) return;
  if ($caller) $db_log_array[] = print_r($sql,1)." -- at $caller[file] line $caller[line]\n";
    else $db_log_array[] = print_r($sql,1)."\n";
}
function db_file_logger($db, $sql, $caller) {
  if (!error_reporting()) return;
  if ($caller) $db_log_string = print_r($sql,1)." -- at $caller[file] line $caller[line]\n";
    else $db_log_string = print_r($sql,1)."\n";
  file_put_contents(FILEROOT.'log/mysql-work.log', $db_log_string, FILE_APPEND);
}

?>