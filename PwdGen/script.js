var specialArr=[" ","!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/",":",";","<",">","=","?","@","[","]","\\","^","_","`","{","|","}","~",],
    numberArr=["0","1","2","3","4","5","6","7","8","9"],
    alphaArr=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

var includeSpecial=document.getElementById("includeSpecial"),
    includeNumber=document.getElementById("includeNumber"),
    includeLowerCase=document.getElementById("includeLowerCase"),
    includeUpperCase=document.getElementById("includeUpperCase"),
    pwdLength=document.getElementById("pwdLength"),
    genPwd=document.getElementById("genPwd"),
    password=document.getElementById("pwd"),
    copyButton=document.getElementById("copyButton"),
    length=document.getElementById("length");

pwdLength.oninput = function(){
    length.innerHTML = this.value;
}   

genPwd.addEventListener("click", function(){
    if(!includeSpecial.checked && !includeNumber.checked && !includeLowerCase.checked && !includeUpperCase.checked) {
        alert("Error! No valid characters for password generation.");
        return;
    }

    var charArr = new Array();
    var pwd = new Array();
    
    pwd.length = pwdLength.value;
    
    //charArr = CreateCharArr(); Would like to use a function, but I'm not sure how to pass a variable instead of a value.
    if (includeSpecial.checked)
    {
        pwd[Math.floor(Math.random()*pwd.length)] = specialArr[Math.floor(Math.random()*specialArr.length)];
        for (var i=0; i < specialArr.length; i++)
        {
            charArr.push(specialArr[i]);
        }
    }
    if (includeNumber.checked)
    {
        var numAdded=false;
        while(!numAdded)
        {
            var rando = Math.floor(Math.random()*pwd.length);
            if(pwd[rando]==undefined)
            {
                pwd[rando]=numberArr[Math.floor(Math.random()*numberArr.length)];
                numAdded=true;
            }
        }
        for (var i=0; i<numberArr.length; i++)
        {
            charArr.push(numberArr[i]);
        }
    }
    if (includeLowerCase.checked)
    {
        var alphaAdded=false;
        while(!alphaAdded)
        {
            var rando = Math.floor(Math.random()*pwd.length);
            if(pwd[rando]==undefined)
            {
                pwd[rando]=alphaArr[Math.floor(Math.random()*alphaArr.length)];
                alphaAdded=true;
            }
        }
        for (var i=0; i<alphaArr.length; i++)
        {
            charArr.push(alphaArr[i]);
        }
    }
    if (includeUpperCase.checked)
    {
        var alphaAdded=false;
        while(!alphaAdded)
        {
            var rando = Math.floor(Math.random()*pwd.length);
            if(pwd[rando]==undefined)
            {
                pwd[rando]=alphaArr[Math.floor(Math.random()*alphaArr.length)].toUpperCase();
                alphaAdded=true;
            }
        }
        for (var i=0; i < alphaArr.length; i++)
        {
            charArr.push(alphaArr[i].toUpperCase());
        }
    }

    //pwd = CreatePwd();
    for (var i=0; i<pwd.length; i++)
    {
        if (pwd[i]==undefined)
        {
            pwd[i]=charArr[Math.floor(Math.random()*charArr.length)];
            //alert (pwd[i]+ " added");
        }
    }
    
    var pwdGenerated = "";
    for (var i=0; i<pwd.length; i++)
    {
        pwdGenerated += pwd[i];
    }

    password.value=pwdGenerated;
    if(copyButton.disabled)
    {
        copyButton.disabled=false;
    }
});

copyButton.addEventListener("click",function(){
    password.select();
    document.execCommand("Copy");
});