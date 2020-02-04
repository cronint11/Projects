$(".date").html(moment().format("dddd")+" - "+moment().format("MMM Do YYYY"));

var currentHour=moment().format('h a').split(" ");
var hourIDs=["#9am","#10am","#11am","#12pm","#1pm","#2pm","#3pm","#4pm","#5pm"];
var placeHolder=0;

console.log(currentHour);
ColorTimeSlots();
LoadSchedule();

function ColorTimeSlots(){
    hourIDs.forEach(element => {
        $(element).removeClass("past");
        $(element).removeClass("present");
        $(element).removeClass("future");
    })
    if (placeHolder==0) {
        if (currentHour[1]=="pm") {
            for(let i=0;i<3;i++){
                $(hourIDs[i]).addClass("past");
            }
            if(currentHour[0]=="12") {
                // it's the noon hour
                $("#12pm").addClass("present");
                for(let i=4;i<hourIDs.length;i++) {
                    $(hourIDs[i]).addClass("future");
                }
            } else {
                // it's after noon
                $("#12pm").addClass("past");
                for(let i=4;i<hourIDs.length;i++) {
                    if (parseInt(hourIDs[i].substring(1))<parseInt(currentHour[0])) {
                        // hourIDs[i] has past
                        $(hourIDs[i]).addClass("past");
                    } else if (parseInt(hourIDs[i].substring(1))==parseInt(currentHour[0])){
                        // hourIDs[i] is current
                        $(hourIDs[i]).addClass("present");
                    } else {
                        // hourIDs[i] is in the future
                        $(hourIDs[i]).addClass("future");
                    }
                    
                }
            }
        } else /* it's am */ {
            if(parseInt(currentHour[0])<9 || currentHour[0]=="12"){
                hourIDs.forEach(element => {
                    // start of the day!
                    $(element).addClass("future");
                });
            } else {
                hourIDs.forEach(element => {
                    if(parseInt(element.substring(1))<parseInt(currentHour[0]) && element.includes("am")) {
                        // element is prior to current time
                        $(element).addClass("past");
                    } else if (parseInt(element.substring(1))==parseInt(currentHour[0])) {
                        // element is current time
                        $(element).addClass("present");
                    } else {
                        // element is in the future
                        $(element).addClass("future");
                    }
                });
            }

        }
    } else if (placeHolder<0) {
        hourIDs.forEach(element => {
            $(element).addClass("past");
        })
    } else {
        hourIDs.forEach(element => {
            $(element).addClass("future");
        })
    }
}

function LoadSchedule(){
    if (localStorage.getItem($(".date").text())){
        $("#myHTML").html(localStorage.getItem($(".date").text()));
    } else {
        //clear cells
        hourIDs.forEach(element => {
            $(element).val("");
        })
    }
}

function LoadDate(){
    if (placeHolder<0) {
        $(".date").html(moment().subtract(Math.abs(placeHolder), "days").format("dddd")+" - "+moment().subtract(Math.abs(placeHolder), "days").format("MMM Do YYYY"));
    } else if (placeHolder==0) {
        $(".date").html(moment().format("dddd")+" - "+moment().format("MMM Do YYYY"));
    } else {
        $(".date").html(moment().add(Math.abs(placeHolder), "days").format("dddd")+" - "+moment().add(Math.abs(placeHolder), "days").format("MMM Do YYYY"));
    }
}

function DateChanged(){
    ColorTimeSlots();
    LoadDate();
    LoadSchedule();
}

$(document).on("click", ".prev", function() {
    placeHolder--;
    
    DateChanged();
});

$(document).on("click", ".next", function() {
    placeHolder++;

    DateChanged();
})

$(document).on("click", ".saveBtn", function() {
    hourIDs.forEach(element => {
        $(element).text($(element).val());
    })
    localStorage.setItem($(".date").text(), $("#myHTML").html());
});

