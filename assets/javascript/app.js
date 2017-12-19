// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAERkq3SHXpnOqjlmxRteYQTTs28Nmtwjw",
    authDomain: "trainschedule-affed.firebaseapp.com",
    databaseURL: "https://trainschedule-affed.firebaseio.com",
    projectId: "trainschedule-affed",
    storageBucket: "",
    messagingSenderId: "556623893467"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

$("#add-data").on("click", function(event) {
  event.preventDefault();


  //values from text boxes
  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTime = $("#first-time-input").val().trim();
  console.log("firstTime: ", firstTime)
  var frequency = $("#frequency-input").val().trim();

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  nextTrain =  moment(nextTrain).format("hh:mm a")

  console.log("nextTrain: ",   nextTrain)
  // the push
  database.ref().push({
    name: name,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency,
    tMinutesTillTrain: tMinutesTillTrain,
    nextTrain: nextTrain
  });

});
//orderByChild("dateAdded").limitToLast(1).
// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref().on("child_added", function(snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  // Console.loging the last user's data
  console.log(sv.name);
  console.log(sv.destination);
  console.log(sv.firstTime);
  console.log(sv.frequency);
  console.log(sv.nextTrain);
  console.log(sv.tMinutesTillTrain);

  // Change the HTML to reflect

  $("#tableBody").append("<tr> <td>" + sv.name + "</td>" + "<td>" + sv.destination + "</td>" + "<td>"
  + sv.frequency + "</td>" + "<td>" + sv.nextTrain + "</td>" + "<td>" + sv.tMinutesTillTrain + "</td> </tr>");

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
