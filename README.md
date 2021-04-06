# auth-api

## Links:

[Heroku link](https://bz-auth-api.herokuapp.com/) <br>

#### MongoDB URI

MONGODB_URI=mongodb+srv://bz-auth-api:CF9brqwouMmo58rp@bz-auth-api.plnfx.mongodb.net/bz-auth-api?retryWrites=true&w=majority <br>

[GitHub action link](https://github.com/bahazghayar/auth-api/actions) <br>

[Pull request link](https://github.com/bahazghayar/auth-api/pull/1) <br>

### For working on the same project:

1. clone the repo
2. install the dependencies `npm i express dotenv cors mongoose morgan jest base-64 bcrypt jsonwebtoken`
3. change the package.json file to
                        "scripts": {
                        "start": "node index.js",
                        "watch": "nodemon",
                        "test-watch": "jest --watchAll",
                        "test": "jest",
                        "lint": "eslint '\*_/_.js'"
                        }

# UML

![auth-api](assets/auth-api.png)