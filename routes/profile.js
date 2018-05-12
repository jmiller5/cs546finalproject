const dbConnection = require("../config/mongoConnection");
const express = require("express");
const router = express.Router();
const data = require("../data");
const activityTypeData = data.activityTypes;
const userActivitiesData = data.userActivities;
const Field = require("../classes/Field");
const uuidv1 = require('uuid/v1');



router.get("/profile", async (req, res) => {
    try{
        const activityStats = await userActivitiesData.getUserActivityStats(req.session.user._id);
        const activityList = await userActivitiesData.getAllUserActivitiesByUserId(req.session.user._id);
        res.render("main/profile", {activities:activityList, actvityStats: activityStats});
    } catch (e) {
        res.status(500).send();
    }

});

router.get("/profile/addactivity", async (req, res) => {
    try{
        const activityList = await activityTypeData.getAllActivtyTypes();
        res.render("main/addactivity", {activities:activityList});
    } catch (e) {
        res.status(500).send();
    }

});

router.post("/profile/addactivity", async (req, res) => {
    let test = req.body;
    test.userId = req.session.user._id;
	//console.log(test.miles);
	//console.log("AAAAAAAAAAAAAAAAAA");
	if('name' in test){
		console.log("BBBBBBBBBBBB");
		let fields = [new Field(uuidv1(), "location", "Where did the activity take place", "String", true, true),
        new Field(uuidv1(), "Date", "Date of the Activity", "Date", true, true),
        new Field(uuidv1(), "Distance", "How many miles did you travel on your activity?", "Number", true, true),
		new Field(uuidv1(), "Duration", "How many minutes did you do your activity for?", "Number", true, true)];
    console.log(fields);
    let activity = await activityTypeData.addActivtyType(test.name, test.description, true, fields);
	res.redirect("/profile");
	
	}
	else {
		try{
			const activityList = await userActivitiesData.addUserActivity(test);
			res.redirect("/profile");

		} catch (e) {
			res.status(500).send();
		}
	}


});
module.exports = router;
