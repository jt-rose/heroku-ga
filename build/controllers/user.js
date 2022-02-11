import express from "express";
export var router = express.Router();
router.get("/connects", function (req, res) {
    res.send("connects landing page");
});
router.get("/messages", function (req, res) {
    res.send("messages landing page");
});
router.get("/meetups", function (req, res) {
    res.send("meetups landing page");
});
router.get("/:userid", function (req, res) {
    res.send("invidivual user page");
});
// may need to create invidivual routes for the connect, message, and meetup forms
router.post("/create-user", function (req, res) {
    res.send("post create-user form data");
});
router.post("/create-message/:recipient", function (req, res) {
    res.send("post form data for sending a new message to another user");
});
router.post("/create-meetup/", function (req, res) {
    res.send(" post form data for creating a new meetup");
});
router.post("/create-connection-invite/:recipient", function (req, res) {
    res.send("post form data for sending a new connection to another user");
});
router.put("/update-profile/:userid", function (req, res) {
    res.send("put form data for updating user profile");
});
router.put("/update-meetup/:meetupid", function (req, res) {
    res.send("put form data to update meetup");
});
router.put("/respond-to-message/:messageid", function (req, res) {
    res.send("put form data to update conversation messages");
});
// at this time messages cannot be updated or deleted
router.delete("/delete-account/:accountid", function (req, res) {
    res.send("delete user account - be careful!");
}); // use sparingly and make sure to cascade delete!
// users should be encouraged to deactivate, rather than delete, their account
// to preserve data integrity for other users
router.delete("/delete-connect-invite/:connectid", function (req, res) {
    res.send("remove connection invite");
});
router.delete("/delete-meetup/:meetupid", function (req, res) {
    res.send("delete meetup - alert invitees");
});
// alert invitees who have responded upon deleting a meetup
