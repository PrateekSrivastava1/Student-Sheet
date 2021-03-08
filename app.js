const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
mongoose.connect("mongodb://localhost:27017/studentsheet", {useNewUrlParser: true});

const itemsSchema = {
  name: String,
  class: Number,
  rollno: Number
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Prateek Srivastava",
  class: 10,
  rollno: 16
});

const item2 = new Item({
  name: "Pranshu Srivastava",
  class: 11,
  rollno: 12
});

const item3 = new Item({
  name: "Try_till_AC Srivastava",
  class: 14,
  rollno: 6
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(err){
  if(err)
  {
    console.log(err);
  }
  else{
    console.log("Successfully save Student info");
  }
})

app.get("/", function(req, res){
  // res.render("home");
  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0)
    {
      Item.insertMany(defaultItems, function(err){
        if(err)
        {
          console.log("error");
        }
        else{
          console.log("great success");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("home", {newListItems: foundItems});
    }
  });
});


app.get("/input", function(req, res){
  res.render("input");
});


app.post("/input",  function(req, res){
  const insertedItem = req.body.newItem;
  const item = new Item({
    name: req.body.name,
    class:req.body.class,
    rollno:req.body.rollno
  });
  console.log(item.name);
  defaultItems.push(item);
  item.save();
  res.redirect("/");
});

let port = process.env.PORT;
if(port == null || port == "")
{
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
