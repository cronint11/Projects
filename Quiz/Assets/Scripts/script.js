var questionCount = 0;
var gradeCount = 0;

$("#start").on("click", function(){
    if ($(this).text()=="Start"){
        InsertQuestion();
        $("#timer").text("####");
        $(this).text("Answer");
    }else if ($(this).text()=="Answer"){
        questionCount++;
        GradeAnswer();
        if(questionCount==questions.length)
        {
            alert("Game Over");
        } else
        {
            InsertQuestion();
        }
    }
});

function InsertQuestion() {
    var qObj=questions[questionCount];
    var htmlToAdd = "<span>"+qObj.question+"</span><br>";
    for(let i=0; i<qObj.choices.length; i++){
        htmlToAdd+="<input name='question' type='"+qObj.type+"' value='"+i+"'>"+qObj.choices[i]+"<br>";
    }
    $("#myDiv").empty();
    $("#myDiv").append(htmlToAdd);
}

$("#answer").on("click", function(){
    alert("here");
    questionCount++;
    GradeAnswer();
    if(questionCount==questions.length)
    {
        alert("Game Over");
    } else
    {
        InsertQuestion();
    }
});

function GradeAnswer() {
   gradeCount++;
}