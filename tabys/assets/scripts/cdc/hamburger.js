$(document).ready(function() {
    $("#hamburguer").click(function() {
        $("#tabys-aside").css({ "display": "block", "width": "100%" });
    });
    $("#cross").click(function() {
        $("#tabys-aside").css("display", "none");
    });

    if ($("#hamburguer").is(":visible")) {
        console.log("visível")
        $("a").click(()=>{
            $("#tabys-aside").css("display", "none");
            console.log("mucoud")
        })
    }



    // $(".cross").click(function () {
    //     $("#navbar2SupportedContent").slideToggle("slow", function () {
    //         $(".cross").attr("hidden",true);
    //         // $(".cross").hide();
    //         $("#hamburger").show();
    //     });
    // });
});
