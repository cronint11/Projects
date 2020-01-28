var questionCount = 0;
var gradeCount = 0;

$("#start").on("click", function(){
    InsertQuestion();
    $("#timer").text("####");
});

function InsertQuestion() {
    var htmlToAdd = "<span>question</span><br><br><input type='radio' value='1'>1<br><input type='radio' value='2'>2<br><button id='answer'>Answer</answer>";
    $("#myDiv").empty();
    $("#myDiv").append(htmlToAdd);
}

$("#answer").on("click", function(){
    alert("here");
    questionCount++;
    GradeAnswer();
    if(questionCount<questions.length)
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