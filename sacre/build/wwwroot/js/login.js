$(window).on('load', function () {
    validateButton()
})

function handleMessage(message) {
    localStorage.setItem("message", message)
    build(message)
}

function build(message) {
    var src = message.isError.toUpperCase().includes('TRUE')?'/Images/alert.svg':'/Images/success_circle.svg'

    $('#modalLoginLabel').html(message.title)
    $('#modalLoginBody').html(message.body)
    $('#modalLoginButtonConfirm').html(message.procceedText)
    $('#modalLoginIcon').attr('src', src)

    if(message.goBackText) {
        $('#modalLoginButtonBack').html(message.goBackText)
    } else {
        $('#modalLoginButtonBack').hide()
    }

    if(message.responseRedirectUrl) {
        $('#modalLoginButtonConfirm').on("click", function () {
            redirect( `/Identity/Account/${message.responseRedirectUrl}`)
        })    
    }

    showModalLogin()
}


function showModalLogin() {
    var modal = '#modalLogin'

    $(modal).modal({ backdrop: 'static', keyboard: false })
}
function redirect(url) {
    document.location = url
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateButton() {
    var button = $('#loginSubmitButton')
    var inputEmail = validateEmail($('#Input_Email').val())
    var inputPassword = $('#password')

    if (inputEmail && inputPassword.val().length >= 8) {
        button.removeClass('faded')
    } else {
        button.addClass('faded')
    }
}