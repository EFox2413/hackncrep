<html>
  <head>
    <title>Maze Game</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css">
    <script type="text/javascript">
      var djConfig = {
        isDebug: false,
        parseOnLoad: true,
        baseUrl: './',
        modulePaths: { }
      };
    </script>
    
    <?php
      //copy input json to used json
      $original = file_get_contents('../ORIGINAL.json');
      file_put_contents('../data.json', $original);
    ?>

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/dojo/1.5/dojo/dojo.xd.js">
    </script>
    <script src="maze_game.js"></script>
  </head>
  <body>
    <center>
      <div align="center">
      <div id="logBg" width = "100" height="600" align="left">
        <p>
        </p>
      </div>
        <canvas id="canvas" width="600" height="600" align="right">
      <p>Your browser does not support the canvas element.</p>
        </canvas>    
      </div>
    </center>
  </body>
</html>