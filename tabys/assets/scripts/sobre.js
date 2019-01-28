$(document).ready(() => {
    $("#about-tabys").click((e) => {
        e.preventDefault();
        $("#about-text").load("../assets/texts/tabys.txt")
    });

    $("#about-esmad").click((e) => {
        e.preventDefault()
        $("#about-text").load("../assets/texts/esmad.txt")
    });

    $("#about-tsiw").click((e) => {
        e.preventDefault();
    $("#about-text").load("../assets/texts/tsiw.txt")
    });
})
