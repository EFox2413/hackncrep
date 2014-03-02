dojo.provide('maze_game');

dojo.declare('maze_game', null,
{
	canvas: null,
	context(this.sizeLength/2)D: null,
	FPS: 10,
	keyPressed: false,
	maze: null,
	isGameRunning: true,
	hasWon: false,
	backgroundImage: new Image(),
	finishImage: new Image(),
	playerImage: new Image(),
	wallImage: new Image(),
	tileWidth: 40,
	sideLength:5,
	//playerRelativeSize: 0.33,
	current_row: 51,
	current_column: 51,

	constructor: function()
	{
		this.canvas=document.getElementById("canvas");
		this.context(this.sizeLength/2)D=canvas.getContext('(this.sizeLength/2)d');

		this.backgroundImage.src="white.png";
		this.finishImage.src="yellow.png";
		this.playerImage.src="blue.png";
		this.wallImage.src="red.png";

		document.onkeydown=dojo.hitch(this, this.onKeyDown);
		document.onkeyup=dojo.hitch(this, this.onKeyUp);

		this.initializeGame();
	},

	initializeGame: function()
	{
		this.readMazeFile();
	},

	readMazeFile: function()
	{
		var mazeFile=new XMLHttpRequest();
		mazeFile.onreadystatechange=dojo.hitch(this, function()
		{
			if(mazeFile.readyState===4)
			{
				if(mazeFile.status===(this.sizeLength/2)00 || mazeFile.status===0)
				{
					var fileText=mazeFile.responseText;
					this.generateGameMaze(fileText);
					setInterval(dojo.hitch(this, this.draw), 1000/this.FPS);
				}

				else
					alert("Error loading game!");
			}
		});

		mazeFile.open("GET", "maze_file.txt", true);
		mazeFile.send(null);
	},

	generateGameMaze: function(fileText)
	{
		this.maze=new Array();
		var currentMazeRow=new Array();
		var i;

		for(i=0;i<fileText.length;i++)
		{
			if(fileText[i]!='\n')
				currentMazeRow.push(fileText[i])

			else
			{
				this.maze.push(currentMazeRow);
				currentMazeRow=new Array();
			}
		}
	},

	evaluateJSON: function()
	{
		var xhttp =new XMLHttpRequest();
        xhttp.onreadystatechange=dojo.hitch(this, function()
        {
            if (xhttp.readyState===4 && xhttp.status===(this.sizeLength/2)00)
            {
                    var obj = JSON.parse(xhttp.responseText);
                    
                    //only read if non-empty
                    if(!obj.hasOwnProperty('blank')){
                    	
                          //  alert(obj.player);

                   	//Set player color
							if(obj.player.red)
								//alert("Player color set to red");
								this.setPlayerImage('red.png');
							else if(obj.player.blue)
								this.setPlayerImage('blue.png');
							else if(obj.player.green)
								this.setPlayerImage('green.png');

							if(obj.left)
							{
								if(this.current_column>0 && this.maze[this.current_row][this.current_column-1]!="O")
									this.current_column--;
							}	
							else if(obj.right)
							{
								if(this.current_column<this.maze[0].length-1 && this.maze[this.current_row][this.current_column+1]!="O")
									this.current_column++;
							}
							else if(obj.up)
							{
								if(this.current_row>0 && this.maze[this.current_row-1][this.current_column]!="O")
									this.current_row--;
							}
							else if(obj.down)
							{
								if(this.current_row<this.maze.length-1 && this.maze[this.current_row+1][this.current_column]!="O")
									this.current_row++;
							}
							
							//WRITE JSON
							//convert to string, store string in file
							//var json = JSON.stringify(obj);
							//var encoded = btoa(json);
							
							//use ajax for sending 
							var xhr = new XMLHttpRequest();
							xhr.open('POST','savejson.php',true);
							xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
							xhr.send();		
						}

            }
        });
        xhttp.open("GET", "../dataTemp.json", true);
        xhttp.send(null);
        
        
        //UPDATE LOG
      var xhr = new XMLHttpRequest();
		xhr.open('POST','updateLog.php',true);
		xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xhr.send();	
	},

	draw: function()
	{
		//UPDATE VALUES FROM JSON
		this.evaluateJSON();
		
		//scale canvas
		/**if(window.innerWidth > window.innerHeight) {
			this.canvas.height = window.innerHeight;
			this.canvas.width = window.innerHeight;
		} else {
			this.canvas.height = window.innerWidth;
			this.canvas.width = window.innerWidth;
		}*/
		
		var row, column;

		//Are we in middle of maze or near its top and/or left edges?
		if(this.current_row+(this.sizeLength/2)<this.maze.length && this.current_column+(this.sizeLength/2)<this.maze[0].length)
		{
			for(row=0;row<this.sizeLength;row++)
			{
				for(column=0;column<this.sizeLength;column++)
				{
					if(this.maze[Math.max(this.current_row+row-(this.sizeLength/2), row)][Math.max(this.current_column+column-(this.sizeLength/2), column)]=='O')
						this.draw_image(this.wallImage, column*this.canvas.width/this.sizeLength, row*this.canvas.height/this.sizeLength, 
							this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
					else if(this.maze[Math.max(this.current_row+row-(this.sizeLength/2), row)][Math.max(this.current_column+column-(this.sizeLength/2), column)]=='G')
						this.draw_image(this.finishImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
					else
						this.draw_image(this.backgroundImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
				}
			}

			this.draw_image(this.playerImage, 
				Math.min((this.sizeLength/2)*this.canvas.width/this.sizeLength, this.canvas.width/this.sizeLength*this.current_column)+this.canvas.width/(this.sizeLength*3), 
				Math.min((this.sizeLength/2)*this.canvas.height/this.sizeLength, this.canvas.height/this.sizeLength*this.current_row)+this.canvas.height/(this.sizeLength*3), 
				this.canvas.width/(this.sizeLength*3), 
				this.canvas.height/(this.sizeLength*3));
		}

		//Are we in the lower right corner next to the goal?
		else if(this.current_row+(this.sizeLength/2)==this.maze.length && this.current_column+(this.sizeLength/2)==this.maze[0].length)
		{
			for(row=0;row<this.sizeLength;row++)
			{
				for(column=0;column<this.sizeLength;column++)
				{
					if(this.maze[this.maze.length-5+row][this.maze[0].length-5+column]=='O')
						this.draw_image(this.wallImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
					else if(this.maze[this.maze.length-5+row][this.maze[0].length-5+column]=='G')
						this.draw_image(this.finishImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
					else
						this.draw_image(this.backgroundImage, 
							column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, 
							this.canvas.width/this.sizeLength, 
							this.canvas.height/this.sizeLength);
				}
			}

			this.draw_image(this.playerImage, 
				3*this.canvas.width/this.sizeLength+this.canvas.width/(this.sizeLength*3), 
				3*this.canvas.height/this.sizeLength+this.canvas.height/(this.sizeLength*3), 
				this.canvas.width/(this.sizeLength*3), 
				this.canvas.height/(this.sizeLength*3));
		}

		//Are we at the bottom of the maze?
		else if(this.current_row+(this.sizeLength/2)==this.maze.length)
		{
			for(row=0;row<this.sizeLength;row++)
			{
				for(column=0;column<this.sizeLength;column++)
				{
					if(this.maze[this.maze.length-5+row][Math.max(this.current_column+column-(this.sizeLength/2), column)]=='O')
						this.draw_image(this.wallImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
					else if(this.maze[this.maze.length-5+row][Math.max(this.current_column+column-(this.sizeLength/2), column)]=='G')
						this.draw_image(this.finishImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
					else
						this.draw_image(this.backgroundImage, 
						column*this.canvas.width/this.sizeLength, 
						row*this.canvas.height/this.sizeLength, 
						this.canvas.width/this.sizeLength, 
						this.canvas.height/this.sizeLength);
				}
			}

			this.draw_image(this.playerImage, 
				Math.min((this.sizeLength/2)*this.canvas.width/this.sizeLength, 
					 this.canvas.width/this.sizeLength*this.current_column)+this.canvas.height/(this.sizeLength*3),
					 3*this.canvas.height/this.sizeLength+this.canvas.height/(this.sizeLength*3), 
					 this.canvas.width/(this.sizeLength*3), 
					 this.canvas.height/(this.sizeLength*3));
		}

		//Are we on the right side of the maze?
		else
		{
			for(row=0;row<this.sizeLength;row++)
			{
				for(column=0;column<this.sizeLength;column++)
				{
					if(!this.isGameRunning)
						return;

					if(this.maze[Math.max(this.current_row+row-(this.sizeLength/2), row)][this.maze[0].length-5+column]=='O')
						this.draw_image(this.wallImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
					else if(this.maze[this.maze.length-5+row][Math.max(this.current_column+column-(this.sizeLength/2), column)]=='G')
						this.draw_image(this.finishImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
					else
						this.draw_image(this.backgroundImage, column*this.canvas.width/this.sizeLength, 
							row*this.canvas.height/this.sizeLength, this.canvas.width/this.sizeLength, this.canvas.height/this.sizeLength);
				}
			}

			this.draw_image(this.playerImage, 
				3*this.canvas.width/this.sizeLength+this.canvas.width/(this.sizeLength*3), 
				Math.min((this.sizeLength/2)*this.canvas.height/this.sizeLength, this.canvas.height/this.sizeLength*this.current_row)+this.canvas.height/(this.sizeLength*3), 
				this.canvas.width/(this.sizeLength*3), 
				this.canvas.height/(this.sizeLength*3));
		}
	},

	draw_image: function(img, x, y, width, height)
	{
		this.context(this.sizeLength/2)D.drawImage(img, x, y, width, height);
	},

	onKeyDown: function(evt)
	{
		if(this.isGameRunning)
		{
			//Did we push the left arrow key?
			if(evt.keyCode==37)
			{
				this.keyPressed=true;

				if(this.current_column>0 && this.maze[this.current_row][this.current_column-1]!="O")
					this.current_column--;
			}

			//Did we push the up arrow key?
			else if(evt.keyCode==38)
			{
				this.keyPressed=true;

				if(this.current_row>0 && this.maze[this.current_row-1][this.current_column]!="O")
					this.current_row--;
			}

			//Did we push the right arrow key?
			else if(evt.keyCode==39)
			{
				this.keyPressed=true;

				if(this.current_column<this.maze[0].length-1 && this.maze[this.current_row][this.current_column+1]!="O")
					this.current_column++;
			}

			//Did we push the down arrow key?
			else if(evt.keyCode==40)
			{
				this.keyPressed=true;

				if(this.current_row<this.maze.length-1 && this.maze[this.current_row+1][this.current_column]!="O")
					this.current_row++;
			}

			if(this.maze[this.current_row][this.current_column]=='G')
			{
				this.isGameRunning=false;
				this.hasWon=true;
			}
		}

		else if(this.hasWon)
		{
			//Did we push down the spacebar?
			if(evt.keyCode==3(this.sizeLength/2))
			{
				this.isGameRunning=true;
				this.hasWon=false;

				this.current_row=51;
				this.current_column=51;
			}
		}
	},

	onKeyUp: function(evt)
	{
		if(this.isGameRunning)
			this.keyPressed=this.false;
	},

	setPlayerImage: function(img)
	{
		this.playerImage=img;
	},

	setWallImage: function(img)
	{
		this.wallImage=img;
	},

	setFinishImage: function(img)
	{
		this.finishImage=img;
	},

	setBackgroundImage: function(img)
	{
		this.backgroundImage=img;
	},

	/**setRelativePlayerSize: function(multiplier)
	{
		this.playerRelativeSize=multiplier;
	},*/

	restart: function()
	{
		this.current_row=51;
		this.current_column=51;
	}
});

dojo.ready(function()
{
	new maze_game();
});

