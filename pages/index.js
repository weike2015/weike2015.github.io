Parse.initialize("ewBEqPQpVnjDmFtKyFEPnRqTcwjdoXG7QAjswiKn", "IsbN1GJKnZFUy2peWC5GXiV1GYJwivbSAh9GyknD");
var currentUser = Parse.User.current();
if (currentUser) {
    ;
} else {
    window.location.replace("login.html");
}

