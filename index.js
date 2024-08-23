const fs = require("fs");
const http = require("http");
const url = require("url");

//FILE READING AND WRITING ASYNC AND SYNC
// console.log("reading file ...");

// fs.readFile("./txt/input.txt", "utf8", (err, data1) => {
//   if (err) {
//     console.log(err);
//   }
//   fs.writeFile("./txt/async.txt", data1, "utf8", (err) => console.log(err));
// });
////////////////////////////////////////////////////////////////////////////////////////////////////
//SERVER

function repalceTemplate(temp, product) {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%PRODUCTNUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
}

//reading the html file and the data.json sync that we read it only once
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObj = JSON.parse(data);

//reading the overview template
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf8"
);
const card = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8"
);

// 1/create the server

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //root and overview routes
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cartsHtml = dataObj.map((el) => repalceTemplate(card, el)).join("");
    const output = overview.replace("{%PRODUCT_CARDS%}", cartsHtml);
    res.end(output);
  }

  //product route
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
      "my-header-ferhat": "hello haha from the res header",
    });

    const product = dataObj[query?.id];
    const output = repalceTemplate(tempProduct, product);
    res.end(output);
  }

  // api side
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }

  // not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "accept-language": "en",
    });
    res.end("<h1> page not found</h1>");
  }
});

//2/listen to the client requests
server.listen(8000, "127.0.0.1", () => {
  console.log("server started...");
});
