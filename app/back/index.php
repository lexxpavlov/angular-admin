<?php
include 'init.php';
//$db->setLogger('db_echo_logger');

$url = substr($_SERVER['REQUEST_URI'],strrpos($_SERVER['SCRIPT_NAME'],'/')+1);
list($url,$params) = explode('?',$url,2);

$method = $_SERVER['REQUEST_METHOD'];
list($section, $id, $action) = explode('/',$url,3);

//echo "$method $section/$id/$action";

$getfields = array(
	'list'=>1,
	'questions'=>array(
		array('id','title','category','answerer','author','created','answered','shown'),
		array('id','category','answerer','title','text','answer','author')
		),
);

$listsql = array(
	'answerers'=>"SELECT id AS ARRAY_KEY,CONCAT(surname,' ',name) AS `name` FROM ?_answerers",
	'categories'=>"SELECT id AS ARRAY_KEY,title FROM ?_question_categories",
);

$sanitizefields = array(
	'questions'=>array('title','text','answer','author'),
);

if (!isset($getfields[$section])) exit;

switch ($method) {
case 'GET':
	switch ($section) {
	case 'list':
		if (!isset($listsql[$id])) exit;
		$answer = $db->selectCol($listsql[$id]);
		break;

	default:
		switch ($action) {
		case 'toggle':
			$answer['ok'] = $db->query("UPDATE ?_$section SET `shown`=(!`shown`) WHERE id=?d",$id);
			break 2;
		}
		$answer = $db->select("SELECT ?# FROM ?_$section{WHERE id=?d}", $getfields[$section][+($id>0)], $id?$id:DBSIMPLE_SKIP);
		if ($id) {
			$answer = $answer[0];
			$answer['tags'] = $db->selectCol("SELECT tag FROM ?_tag_links WHERE `type`='$section' AND `id`=?d", $id);
		}
		break;
	}
	break;

case 'PUT': // create item
	$data = load_raw_post($getfields[$section][1]);
	$data['changed'] = $db->subQuery('NOW()');
	data_create_prepare($data);
	$success = $db->query("INSERT INTO ?_$section SET ?a", $data);
	break;

case 'POST': // edit item
	$data = load_raw_post($getfields[$section][1]);
	$id = $data['id']; unset($data['id']);
	$data['changed'] = $db->subQuery('NOW()');
	data_edit_prepare($data,$id);
	$success = $db->query("UPDATE ?_$section SET ?a WHERE id=?d", $data, $id);
	$answer = $data;
	break;

case 'DELETE':
	if (isset($DATA['ids'])) $id = explode(',',$DATA['ids']);
	$success = $db->query("DELETE FROM ?_$section WHERE id IN (?a)",(array)$id);
	break;
}

function data_create_prepare(&$data) {
	global $section;
	sanitize($data);
	switch ($section) {
	case 'questions':
		$data['created'] = $db->subQuery('NOW()');
		if (strlen(trim($data['answer']))>0) $data['answered'] = $db->subQuery('NOW()');
		break;
	}
}

function data_edit_prepare(&$data, $id) {
	global $section;
	sanitize($data);
	switch ($section) {
	case 'questions':
		if (strlen(trim($data['answer']))>0) {
			if (!$db->selectCell("SELECT answered FROM ?_$section WHERE id=?d", $id))
				$data['answered'] = $db->subQuery('NOW()');
		} else $data['answered'] = null;
		break;
	}
}

function sanitize(&$data) {
	global $section, $sanitizefields;
	foreach($sanitizefields[$section] as $field)
		if (isset($data[$field])) $data[$field] = htmlspecialchars($data[$field]);
}

?>