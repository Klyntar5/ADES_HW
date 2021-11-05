//How Zu Kang Adam DIT/FT/2B/03 p2026677
console.log("---------------------------------");
console.log(" ADES > HW > Week 1 > server.js");
console.log("---------------------------------");

//-----------------------------------
// imports
//-----------------------------------

const app = require('./controller/app');


//-----------------------------------
// configurations
//-----------------------------------
const hostname = "localhost";
const port = 3000;

//-----------------------------------
// main
//-----------------------------------
app.listen(port, hostname, () => {
    console.log(`Server started and accessible via http://${hostname}:${port}/`);
});