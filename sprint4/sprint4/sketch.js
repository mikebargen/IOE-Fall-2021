/* 
August 2019 - Doug Whitton 
The base code is from the example 'play 3 analog sensors that output sound and circle graphic'
The Arduino file that's running is "threeSensorExample"
*/

let osc;
let playing = false;
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
let splitter;
let value0 = 0, value1 = 0, value2 = 0; //Changed 'diameter' to 'value' for me to eaisly manipulate

let osc1, osc2, osc3, fft;

let song;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  
  song = loadSound('assets/assets_sounds_zig-zag.mp3'); //This code is from the 'load sounds' example

///////////////////////////////////////////////////////////////////
    //Begin serialport library methods, this is using callbacks
///////////////////////////////////////////////////////////////////    
    

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();
  console.log("serial.list()   ", serial.list());

  //////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("COM3");
 /////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////
  // Here are the callbacks that you can register

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);

 
}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////


   



// We are connected and ready to go
function serverConnected() {
  console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log("currentString  ", currentString);             // println the string
  latestData = currentString;            // save it for the draw method
  console.log("latestData" + latestData);   //check to see if data is coming in
  splitter = split(latestData, ',');       // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  value0 = splitter[0];                 //put the first sensor's data into a variable
  value1 = splitter[1];
  value2 = splitter[2]; 



}

// We got raw data from the serial port
function gotRawData(thedata) {
  println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device

// Using the if statement to now change the colours of the circles with the potentiometer
function draw() {
  text(latestData, 10,10);

    background(255, 255, 255);

  ellipseMode(RADIUS);  
  if (value2 > 1) {
    fill(10, 120, value1);

}
if (value2 < 1) {
    fill(0, 0, 0);  
}    
 // fill(255,0,0);
  noStroke(); 
  //console.log("value0  "  + value0);
  ellipse(785, 475, 30, 30);
  ellipse(935, 475, 30, 30);
  triangle(760, value0*400, 860, value0*250, 960, value0*400);
  ellipseMode(RADIUS);
  if (value2 > 1) {
    fill(0, 255, value1);
}
if (value2 < 1) {
    fill(0, 0, 0);
}        
  //changing the points of the rectangle to move from the inputs of the potentiometer
  rect(value1, 255, value1, value1);
  if (value2 > 1) {
    fill(205, 55, value1);
}
if (value2 < 1) {
    fill(0, 0, 0);
}    

ellipse(860, 230, value0*30, value0*30);

//value2*10 

//using the light sensor to change the position of one of the squares
rect(value2, value2, value2, value2);

//included text so users know to activate sound
textSize(24);
text("click mouse to activate sound", 850, 90);
playShape();
}


//Created an if statement to change the shape of the smile when the button is pressed
function playShape() {
  if (value0 == 1) {
    bezier(746,619, 785,743, 983,743, 997,619);
  }
  if (value0 == 0) {
    bezier(746,719, 785,600, 983,600, 997,719)
      //Text place in here so it disapers when picture appears
      textSize(24);
text("Press Button to make face happy :)", 820, 150);
  }
};


//This code is from the 'load sounds' example
function mouseClicked(){
  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.stop();
  } else {
    song.play();
  }
  };
  


  

 