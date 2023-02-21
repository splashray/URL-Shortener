const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const shortId = require("shortid")

const ShortUrl = require("../models/shortUrlModel")
const User = require("../models/userModel")


const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each user to 10 requests per windowMs
    message:
      "You have exceeded the rate limit of 10 requests per hour. Please try again later.",
});

router.get('/', async (req,res)=>{
    const user = req.cookies.user_id;
    let shortUrls = [];

    if (user) {
        // Get the short URLs belonging to the current user
       shortUrls = await ShortUrl.find({ userId: user });
    } 
    //else show them nothing
    res.render('Index', {shortUrls:shortUrls})
})

router.post('/shortUrls', limiter, async (req, res) => {
    let shortUrl;

    // get user's if from the cookie
    const userId = req.cookies.user_id;

    if (userId) {
      // User already has a cookie, check if user exists in the database
      const user = await User.findById(userId);
  
      if (user) {
        shortUrl = await ShortUrl.create({
          full: req.body.fullUrl,
          userId: user._id
        });
      } else {
        // User ID in the cookie is invalid, remove the cookie and create a new user
        res.clearCookie('user_id');
        const newUser = await User.create({
          cookieId: shortId.generate(),
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });
        shortUrl = await ShortUrl.create({
          full: req.body.fullUrl,
          userId: newUser._id
        });
        res.cookie('user_id', newUser._id, { maxAge: 900000, httpOnly: true });
      }
    } else {
      // User doesn't have a cookie, generate a new ID and set the cookie
      const newUser = await User.create({
        cookieId: shortId.generate(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });
      shortUrl = await ShortUrl.create({
        full: req.body.fullUrl,
        userId: newUser._id
      });
      res.cookie('user_id', newUser._id, { maxAge: 900000, httpOnly: true });
    }
    res.redirect('/');
});  

router.get('/:shortUrl', async(req, res)=>{
const user = req.cookies.user_id;
const shortUrl =  await ShortUrl.findOne({ short: req.params.shortUrl, userId: user});
   if(shortUrl ==null) return res.sendStatus(404)
   shortUrl.clicks++
   shortUrl.save()

   res.redirect(shortUrl.full)
})


module.exports = router;
