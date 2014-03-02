<?php


//GET DATA FROM EMAIL
$from = $_POST["from"];          //email of sender
$subject = $_POST["subject"];    //subject of email
$cmd = strtolower($_POST["text"]);          //text msg sent
$isValidCmd = true;           //flag for valid cmd

//UPDATE EVENT LOG
$file = 'eventlog.txt';
$contents =  print_r($_POST, true);
file_put_contents($file, $contents, FILE_APPEND);
$contents = "";

//READ JSON
$str_data = file_get_contents("data.json");
$data = json_decode($str_data,true);

//PARSE COMMAND
$cmd1 = "";
$cmd2 = "";

$cmds = explode(" ", $cmd, 2);
$cmd1 = $cmds[0];
if(sizeof($cmds) == 2)
   $cmd2 = $cmds[1];

//reset first commands
$data['left']=false;
$data['right']=false;
$data['up']=false;
$data['down']=false;

$data['normal'] = false;
$data['hacknc'] = false;
$data['doge'] = false;
$data['zelda'] = false;


//DOUBLE COMMANDS
if(($cmd1 == 'player') ||
    ($cmd1 == 'wall') ||
    ($cmd1 == 'ground'))
{
  //RESET
  $data[$cmd1]['red'] = false;
  $data[$cmd1]['blue'] = false; 
  $data[$cmd1]['green'] = false;
  $data[$cmd1]['yellow'] = false;
  $data[$cmd1]['black'] = false;
  $data[$cmd1]['white'] = false; 
  $data[$cmd1]['orange'] = false;
  $data[$cmd1]['purple'] = false;
  $data[$cmd1]['normal'] = false;
  $data[$cmd1]['hacknc'] = false;
  $data[$cmd1]['doge'] = false;
  $data[$cmd1]['zelda'] = false;
  
   //CHECK
   if(($cmd2 == 'red') ||
      ($cmd2 == 'blue') ||
      ($cmd2 == 'green') ||
      ($cmd2 == 'yellow') ||
      ($cmd2 == 'black') ||
      ($cmd2 == 'white') ||
      ($cmd2 == 'orange') ||
      ($cmd2 == 'purple') ||
      ($cmd2 == 'normal') ||
      ($cmd2 == 'pokemon') ||
      ($cmd2 == 'hacknc') ||
      ($cmd2 == 'doge') ||
      ($cmd2 == 'zelda'))
  {
    $data[$cmd1][$cmd2] = true; 
  } else 
    $isValidCmd = false;
  }
} 

//SINGLE COMMANDS
else if(($cmd1 == 'left') ||
        ($cmd1 == 'right') ||
        ($cmd1 == 'up') ||
        ($cmd1 == 'down') ||
        ($cmd1 == 'normal') ||
        ($cmd1 == 'pokemon') ||
        ($cmd1 == 'hacknc') ||
        ($cmd1 == 'doge') ||
        ($cmd1 == 'zelda'))
{
  $data[$cmd1] = true;
} else {
   $isValidCmd = false;
}

//STORE JSON
$str_data = json_encode($data);
file_put_contents('data.json', $str_data);
file_put_contents('dataTemp.json', $str_data);

//UPDATE COMMAND LOG
$file = 'commandLog.txt';
$contents = print_r($cmd, true);
if($isValidCmd) {
   $contents = 'VALID COMMAND!! =>    ' . $contents . PHP_EOL;
} else {
   $contents = '----invalid---- =>    '  . $contents . PHP_EOL;
}

file_put_contents($file, $contents, FILE_APPEND);

//reply with HTTP 200 Response so SendGrid doesn't retry the post
header("HTTP/1.1 200 OK");
?>
