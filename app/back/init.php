<?php
include '../../sys/bdauth.php';

if (!setlocale(LC_CTYPE ,"ru_RU.UTF-8")) setlocale(LC_CTYPE,"ru_RU");
register_shutdown_function('ajax_shutdown');
ob_start();

$DATA = $_REQUEST;
$success = 0;
$answer = array();

function load_raw_post() {
	$data = json_decode(trim(file_get_contents('php://input')),1);
	$args = func_get_args();
	if ($args) {
		$names = array();
		foreach ($args as $a)
			if (is_array($a)) $names = array_merge($names,$a); else $names[] = $a;
		$data_filtered = array();
		foreach ($names as $k) $data_filtered[$k] = $data[$k];
		return $data_filtered;
	}
	return $data;
}

function ajax_shutdown() {
  global $answer, $success, $ajax_type;
	$text = ob_get_clean();
  if ($text) $answer['text'] = $text;
  switch ($ajax_type) {
  case 'text':
    header('Content-Type: text/html; charset=utf-8');
    echo $answer['text']; break;
  default:
    header('Content-Type: text/javascript; charset=utf-8');
    echo ")]}',\n"; // JSON Vulnerability Protection by Angular
    echo json_encode($answer);
  }
}
?>