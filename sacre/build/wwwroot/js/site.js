// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.

var LoadingStatus = true
var JumpLoading = false

function LoadingON() {
    if (LoadingStatus) {
        $('#backLoading').fadeIn();
        $('#img-loading').fadeIn();
    }
}

function LoadingOFF() {
    $('#backLoading').fadeOut();
    $('#img-loading').fadeOut();
}

function OpenModalById(idModal) {
    $(idModal).modal({ backdrop: 'static', keyboard: false })
}

function CloseModalById(idModal) {
    $(idModal).modal('hide');
}

$(function () {
    let jumpObj = $('#jumploadding')

    if (jumpObj) {
        JumpLoading = Boolean(jumpObj.val()) == true

        if (!JumpLoading) {
            showLoadding($(document))
        }
    }
    else {
        showLoadding($(document))
    }

})

function showLoadding(doc) {
    doc.ajaxStart(function () {
        LoadingON()
    }
    ).ajaxStop(function () {
        LoadingOFF()
    })

    doc.submit(function () {
        LoadingON()
    })
}

function isJumpLoadding() {
    // * Bloquear por rota
    let rota = location.href.toLowerCase()
    JumpLoading = rota.indexOf('importcsv') > -1

    return JumpLoading === true
}

function PopupSucess(title, message) {
    $('#titleSuccessLabel').val(title)
    $('#bodyMessageSuccess').val(title)
    $('#modalSuccess').modal({ backdrop: 'static', keyboard: false })
}

function PopupError(title, message) {
    $('#titleErrorLabel').val(title)
    $('#bodyMessageError').val(title)
    $('#modalError').modal({ backdrop: 'static', keyboard: false })
}

function PopupQuestion(title, message) {
    $('#titleQuestLabel').val(title)
    $('#bodyMessageQuest').val(title)
    $('#modalQuestion').modal({ backdrop: 'static', keyboard: false })
}

function openNav() {
    document.getElementById("mySidenav").style.width = "350px";
    document.getElementById("main").style.overflow = "hidden";
    document.getElementById("sideNavFade").style.display = "block";
    document.getElementById("sideNavFade").style.backgroundColor = "#000000c4";
    document.getElementById("sideNavFade").style.position = "absolute";
    document.getElementById("sideNavFade").style.top = "0";
    document.getElementById("sideNavFade").style.zIndex = "9998";
    document.getElementById("sideNavFade").style.width = "100%";
    document.getElementById("sideNavFade").style.height = "100%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("sideNavFade").style.display = "none";
}