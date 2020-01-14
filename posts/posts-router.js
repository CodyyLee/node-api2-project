const router = require("express").Router();
const posts = require("../data/db.js");

router.get("/", (req, res) => {
    posts.find()
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "There was an error retrieving the posts."
            })
        })
})

router.get("/:id", (req, res) => {
    const id = req.params.id;
    posts.findById(id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({
                    errorMessage: "The post with this ID does not exist."
                });
            }
            else{
                res.status(200).json(post);
            }
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "There was an error finding this post."
            })
        })
})

router.post("/", (req, res) => {
    const body = req.body;
    const keys = Object.keys(body);

    if(keys.includes("title") && keys.includes("contents")) {
        posts.insert(body)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    errorMessage: "There was an error saving your post to the database."
                })
            })
    }
    else {
        res.status(400).json({
            errorMessage: "Posts require a title and contents."
        })
    }
})

router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const keys = Object.keys(body);

    posts.findById(id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({
                    errorMessage: "A post with this ID was not found."
                })
            }
            else {
                if(keys.includes("text")) {
                    posts.insertComment(body)
                        .then(comment => {
                            res.status(201).json(comment)
                        })
                        .catch(err => {
                            res.status(500).json({
                                errorMessage: "There was an error saving your comment."
                            })
                        })
                }
                else {
                    res.status(400).json({
                        errorMessage: "Please provide text for the comment."
                    })
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "There was an error finding this post."
            })
        })
})

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;

    posts.findById(id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({
                    errorMessage: "A post with this ID was not found."
                })
            }
            else {
                posts.findPostComments(id)
                    .then(comments => {
                        res.status(200).json(comments);
                    })
                    .catch(err => {
                        res.status(500).json({
                            errorMessage: "There was an error retrieveing comments to this post."
                        })
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "There was an error retrieving posts from the database."
            })
        })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id;

    posts.findById(id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({
                    errorMessage: "A post with this ID could not be found."
                })
            }
            else{
                posts.remove(id)
                    .then(post => {
                        res.status(200).json(post)
                    })
                    .catch(err => {
                        res.status(500).json({
                            errorMessage: "There was an error attempting to delete this post."
                        })
                    })
            }
        })
        .catch(err => {

        })
})

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const keys = Object.keys(body);

    posts.findById(id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({
                    errorMessage: "Post with this ID was not found."
                })
            }
            else{
                posts.update(id, body)
                    .then(post => {
                        if(keys.includes("title") && keys.includes("contents")) {
                            res.status(200).json(post)
                        }
                        else {
                            res.status(400).json({
                                errorMessage: "Please include a title and contents for this post."
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            errorMessage: "There was an error trying to update this post."
                        })
                    })
            }
        })
})

module.exports = router;