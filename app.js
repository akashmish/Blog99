var bodyParser=require('body-parser');
var mongoose= require('mongoose');
var express= require('express');
var expressSanitizer=require('express-sanitizer');
const { render } = require('ejs');
var app=express();
var methodOverride=require('method-override');

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser:true}); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
const hosttitle='localhost';
const port =3000;

//create a schema
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);



// Blog.create({
//     title:"TEst BLOG",
//     image:"https://blinkbits.com/wp-content/uploads/2018/10/Blogs-1-696x295.jpg",
//     body: "THIS IS A BLOG POSTTTT"
// });

app.get("/",function(req,res){
    res.redirect("/blogs")
})
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        {console.log(err);}
        else
        {res.render("index",{blogs:blogs});}
    });
});
app.get("/blogs/new",function(req,res){
    res.render("new");
})
app.post("/blogs",function(req,res){
    var title=req.body.title;
    var image=req.body.image;
    var body=req.body.body;
    var newBlog={title:title, image:image, body:body}
// create a nerw campground and save to database
Blog.create({title:title, image:image,body:body}, function(err,newlyCreated){
    if(err)
    {console.log(err);}
    else
    {
        res.redirect("/Blogs");
    }
})  
});
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {res.redirect("/blogs");}
        else
        {
            res.render("show",{blog:foundBlog});
        }
    });
});
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {res.redirect("/blogs");}
        else
        {
            res.render("edit",{blog:foundBlog});
        }
    });
});

//update route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
        {res.redirect("/blogs");}
        else
        {
            res.redirect("/blogs/"+req.params.id);
        }
    });

});
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {res.redirect("/blogs");}
        else
        {
            res.redirect("/blogs");
        }
    });

});




app.listen(port,hosttitle,()=>{
    console.log(`The Yelpcamp server is running at ${hosttitle}: ${port}`);
});