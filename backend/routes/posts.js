const express = require("express");
const Post = require('../models/post');
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

router.post("", checkAuth, (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Post added successfully",
            postId: result._id
        });
    });
});

router.put('/:id', checkAuth, (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });

    Post.updateOne({_id: req.params.id}, post).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Post updated successfully",
            postId: result._id
        });
    });
});

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "post not found!"});
        }
    });
});

router.get('', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    console.log(req.query);
    postQuery.then((documents) => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.json({
            message: "Posts fetched successfully",
            posts: fetchedPosts,
            maxPosts: count
        });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    console.log("delete -> " + req.params.id);
    Post.deleteOne({
        _id: req.params.id
    }).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Post deleted!"
        });
    });
})

module.exports = router;