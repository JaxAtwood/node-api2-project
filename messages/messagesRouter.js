const express = require("express");
const db = require("../data/db.js");

const router = express.Router();

module.exports = router;

//1//-----POST (api/posts) 
//2//POST (api/posts/:id/comments)
//3//-----GET (api/posts)
//4//-----GET (api/posts/:id)
//5//-----GET (api/posts/:id/comments)
//6//-----DELETE (/api/posts/:id)
//7//-----PUT (/api/posts/:id)


//1 POST /API/POSTS
router.post("/", (req, res) => {
    const {title, contents} = req.body;

    if (!title || !contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
    db.insert({title, contents})
        .then(id => {
            res.status(201).json(id)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "There was an error while saving the post to the database" });
        })
})


//2 POST /API/POSTS/:ID/COMMENTS
router.post("/:post_id/comments", (req, res) => {
    const {post_id} = req.params;
    const {text} = req.body;

    if (!text || text === "") {
       return res.status(400).json({ errorMessage: "Please provide text for the comment." });
    }

    db.insertComment({post_id, text})
        .then(commentID => {
            db.findCommentById(commentID)
             .then(comments => {
                 if ([comments]) {
                     console.log("comment", comments)
                    res.status(201).json({text});
                 } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                 }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the comment to the database" });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "There was an error while saving the comment to the database"})
        })
    })
        

//3 GET /API/POSTS
router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The post information could not be retrieved." });
        })
})

//4 GET /API/POSTS/:ID
router.get("/:id", (req, res) => {
    const {id} = req.params;
    
    db.findById(id)
        .then(post => {
            if(post.length) {
            res.status(200).json(post);
            } else {
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "The comments information could not be retrieved."})
        })
})


//5 GET /API/POSTS/:ID/COMMENTS
router.get("/:id/comments", (req, res) => {
    const { id } = req.params;

    db.findPostComments(id)
        .then(comments => {
            if (comments.length) {
            res.status(200).json(comments);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The comments information could not be retrieved." });
        })
})



//6 DELETE /API/POSTS/:ID
router.delete("/:id", (req, res) => {
    const {id} = req.params;

    db.remove(id)
        .then(id => {
            if (post => post.id === id) {
                res.status(200).json({ message: "You good, it's gone" });
            } else {
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist" });
            }
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "The post could not be removed" });
        })
})


//7 PUT /API/POSTS/:ID
router.put("/:id", (req, res) => {
    const {id} = req.params;
    const postUpdate = req.body;

    db.update(id, postUpdate)
        .then(post => {
            if (post) {
            if(postUpdate.title && postUpdate.contents) {
                    res.status(200).json( postUpdate );
            } else {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
            }
        } else {
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
        }
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The post information could not be modified." })
        })
})