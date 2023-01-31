const express=require('express');
const path=require('path');
const expressStaticGzip=require('express-static-gzip');

const app=express();
const port=process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.static(path.resolve(__dirname,'./dist')));

app.use(expressStaticGzip('dist'));

app.listen(port,()=>console.log(`Server is running in ${port}`));