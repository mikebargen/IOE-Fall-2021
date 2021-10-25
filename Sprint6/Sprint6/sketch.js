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
let img, img2; 
let value0 = 0, value1 = 0, value2 = 0; //Changed 'diameter' to 'value' for me to eaisly manipulate

let osc1, osc2, osc3, fft;

let song2, song3;
let slider;




//Had to create a preload function to load the background audio from the start
function preload() {
  //Labyrinth of Lost Dreams by Darren Curtis | https://www.darrencurtismusic.com/ 
  song3 = loadSound('assets/Labyrinth-of-Lost-Dreams.mp3');
}
 

function setup() {
  
  
  createCanvas(windowWidth, windowHeight);
  song3.play();


  //Code on how to make a slider from 'The Coding Train' on youtube
  //https://www.youtube.com/watch?v=Pn1g1wjxl_0&ab_channel=TheCodingTrain
  //This slider is made to adust the volume of the background audio that is always playing 
  slider = createSlider(0, 1, 0.5, 0.01);

  //free sound effects from https://www.fesliyanstudios.com
  song2 = loadSound('assets/Female-Screaming.mp3');


  
  

  //Image from https://bloody-disgusting.com
  img = loadImage('assets/nun.png');

  //Photo by m wrona on Unsplash. https://unsplash.com/photos/pCgxm-HDMNs 
  img2 = loadImage('assets/hauntedhouse.jpg');

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


function draw() {
  text(latestData, 10,10); 
  background(img2, 1, 1, windowWidth, windowHeight);
  playImage();
  setVolume();
}



//Created a function that allows the sound to be adjusted with the potentiometer 
function setVolume() {
    song3.setVolume(value1*0.01);
}

//Created an if statement that triggers an image and sound to be played when pressed
function playImage() {
  if (value0 == 1) {
      song2.loop();
      image(img, 0.11, 0.1, windowWidth, windowHeight);
  }
  if (value0 == 0) {
      song2.stop();
      //Text place in here so it disapers when picture appears
      textSize(24);
text("Press Button For a Surprise! (Warning Jump Scare)", 650, 100);
  }
};






  


  

 