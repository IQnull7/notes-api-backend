const express =  require('express');
const app = express();

const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth')

app.set("view engine", "ejs");
app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/auth', authRouter)
app.use('/notes', notesRouter);

function logger(req, res, next){
  console.log("Method: ", req.method);
  console.log("URL: ", req.url);
  console.log("Logger Added.");
  next();
}

app.use(logger);

app.get('/', async function (req, res) { 
    res.render("index", {
      name: 'Abhinav'
    });
});

app.use((req, res, next) => { //No route handler
  return res.status(404).json({
    message: "Route does not exist."
  })
})

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
});

app.listen(3000, () => {
  console.log("Server running");
});