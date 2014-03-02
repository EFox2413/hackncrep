<<<<<<< HEAD
<html>
 <head>
  <title>EMAIL GAME</title>
 </head>
 <body>
 
 <?php
   //FOR SENDGRID
   include 'sendgrid-php/lib/SendGrid.php';
   require_once 'unirest-php/lib/Unirest.php';
   require_once 'sendgrid-php/lib/SendGrid.php';
   require_once 'smtpapi-php/lib/Smtpapi.php';
   SendGrid::register_autoloader();
   Smtpapi::register_autoloader();
   
   
   //READ JSON
   $str_data = file_get_contents("data.json");
   $data = json_decode($str_data,true);
   
   $username = $data["login"]["username"];
   $password = $data["login"]["password"];
   $sendTo = 'EFox2413@gmail.com';
   $sendFrom = $data["send"]["from"];
   
   //INITIALIZE SENDGRID
   $sendgrid = new SendGrid($username, $password);
   
   //MAKE AND SEND EMAIL
   $mail = new SendGrid\Email();
   $mail->
      addTo($sendTo)->
      setFrom($sendFrom)->
      setSubject('Subject goes here')->
      setText('Hello World!')->
      setHtml('<strong>Hello World!</strong>');
   
   $sendgrid->send($mail);
         
   echo 'PAGE';
   
?>

 </body>
=======
<html>
 <head>
  <title>EMAIL GAME</title>
 </head>
 <body>
 
 <?php
   require 'vendor/autoload.php'
   include 'sendgrid-php/lib/SendGrid.php';
   
   //INITIALIZE SENDGRID
   $sendgrid = new SendGrid('jrdbnntt', 'hackFSU');
   
   $siteEmail = 'test@test.jaredisawesome';
      
   //MAKE EMAIL
   $mail = new SendGrid\Mail();
   $mail->
      addTo('jrdbnntt@gmail.com')->
      setFrom($siteEmail)->
      setSubject('TEST FROM SENDGRID')->
      setText('YAY!!!!')->
      setHtml('<strong>YAY!!!!</strong>');
      
   //SEND EMAIL
   $sendgrid->
      smtp->
         send($mail);
         
   echo 'PAGE'
   
   
?>
 
 

 </body>
>>>>>>> af0a2727ea435dd4d3b9bdc153da58b37d413854
</html>