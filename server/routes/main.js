const express = require('express');
const router = express.Router();
const Post = require('../models/post')

router.get('/', async (req, res, next) => {
    const local = {
        title: 'Trang chu',
        description: 'Day la trang chu'
    }

    try {
        let perPage = 8;
        let page = req.query.page || 1;
    
        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
    
        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        console.log(hasNextPage);
        res.render('index', { 
          local,
          data,
          current: page,
          nextPage: hasNextPage ? nextPage : null,
        });
    }catch(error){
        console.log(error);
    }

    
})

// function insertData () {
//     Post.insertMany([
//         {
//             title: "10 ngay giam can",
//             body: "Cach de giam can hieu qua    "
//         },
//         {
//             title: "10 ngay giam can",
//             body: "Cach de giam can hieu qua    "
//         },
//         {
//             title: "8 ngay giam can",
//             body: "Cach de giam can hieu qua    "
//         },
//         {
//             title: "9 ngay giam can",
//             body: "Cach de giam can hieu qua    "
//         },
//         {
//             title: "7 ngay giam can",
//             body: "Cach de giam can hieu qua    "
//         },
//         {
//             title: "5 ngay giam can",
//             body: "Cach de giam can hieu qua    "
//         },
//         {
//             title: "10 ngay giam can",
//             body: "Cach de giam can hieu qua    "
//         },

//     ])
// }
// insertData();

router.get('/post/:id', async (req, res, next) => {
    

    try {

        const slug = req.params.id;
        const data = await Post.findById({_id: slug});
        const local = {
            title: data.title,
            description: ' '
        }
        
        res.render('post', { 
          local,
          data,
        });
    }catch(error){
        console.log(error);
    }

    
})

router.post('/search', async (req, res, next) => {
    try {

        const local = {
            title: 'Search',
            description: ' '
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
        const data = await Post.find( {
        $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
          ]
    })
    res.render('search', { 
        local,
        data,
    });
    }catch(error){
        console.log(error);
    }

    
})


module.exports = router;
