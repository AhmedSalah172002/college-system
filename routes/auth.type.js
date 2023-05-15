exports.isAdmin=((req,res,next)=>{
    if(req.session.type=="admin") next()
    else res.redirect("/")
})

exports.isDoctor=((req,res,next)=>{
    if(req.session.type=="doctor") next()
    else res.redirect("/")
})

exports.isStudent=((req,res,next)=>{
    if(req.session.type=="student") next()
    else res.redirect("/")
})
