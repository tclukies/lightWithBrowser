var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
const Gpio = require('onoff').Gpio;
const LED = new Gpio(4, 'out'); // gpio 4 as out

http.listen(8080 || process.env.PORT); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    if (lightvalue) {
    LED.writeSync(1); // make it 1 (on)
    console.log("on")
    }
    else {
      LED.writeSync(0); // make it 0 (off)
      console.log("working!")}
  });
});


 
 
// const timer = setInterval(()=>{
//   if (LED.readSync() === 0) { // if current pin state is 0 (off)
//     LED.writeSync(1); // make it 1 (on)
//   } else {
//     LED.writeSync(0); // make it 0 (off)
//   }
// }, 1000);
  
 
// function switchOff(){
//   clearInterval(timer);
//   LED.writeSync(0); // making the gpio 4 off. Will turn LED off
//   LED.unexport(); // Unexport GPIO to free resources
// }
 
// setTimeout(switchOff, 10000);