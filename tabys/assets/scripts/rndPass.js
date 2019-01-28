

function randomPassword(){
    let possibleChars = "abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ1234567890";
    let passwordSize = 8;
    let password = "";
    
    for (let x = 0; x < passwordSize; x++) {
        password += possibleChars.charAt(parseInt(Math.floor((Math.random()*possibleChars.length))));
    }

    return password;
};

function randomPasswordRequestPath(){
    let possibleChars = "abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ1234567890";
    let pathSize = 100;
    let path = "";
    
    for (let x = 0; x < pathSize; x++) {
        path += possibleChars.charAt(parseInt(Math.floor((Math.random()*possibleChars.length))));
    }

    return path;

}

module.exports = {randomPassword: randomPassword,
                  randomPasswordRequestPath: randomPasswordRequestPath};

