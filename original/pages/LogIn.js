Parse.initialize("ewBEqPQpVnjDmFtKyFEPnRqTcwjdoXG7QAjswiKn", "IsbN1GJKnZFUy2peWC5GXiV1GYJwivbSAh9GyknD");


$("#signUp").click(function(){

var email = $("#email").val();
var password = $("#password").val();

var user = new Parse.User();
user.set("username", email);
user.set("password", password);
user.set("email", email);


user.signUp(null, {
  success: function(user) {
    alert("Sign up success");
    window.location.replace("index.html");
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});

});


$("#logIn").click(function(){

var email = $("#email").val();
var password = $("#password").val();


alert("adf");
Parse.User.logIn(email, password, {
  success: function(user) {
    alert("login success");
    window.location.replace("index.html");

  },
  error: function(user, error) {
  	alert("login fail");
  }
})

});






