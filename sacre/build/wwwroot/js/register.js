var modal = '#modalRegister'

$(window).on('load', function () {
    validateButton()
})

function handleMessage(message) {
    localStorage.setItem("message", message)
    build(message)
    
}

function build(message) {
    var src = message.isError.toUpperCase().includes('TRUE')?'/Images/alert.svg':'/Images/success_circle.svg'
    
    $('#modalRegisterLabel').html(message.title)
    $('#modalRegisterBody').html(message.body)    
    $('#modalRegisterButtonConfirm').html(message.procceedText)   
    $('#modalRegisterIcon').attr('src', src)
    
    if(message.goBackText) {
        $('#modalRegisterButtonBack').html(message.goBackText)   
    } else {
        $('#modalRegisterButtonBack').hide()
    }
    
    if(message.isError.toUpperCase().includes('FALSE')) {
        $('#modalRegisterButtonConfirm').on("click", function () {
            redirect("/Identity/Account/Login")
        })    
    }
    
    showModal()
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateButton() {
    var button = $('#create-account')
    var inputFirstName = $('#firstName')
    var inputLastName = $('#lastName')
    var inputEmail = validateEmail($('#email').val())
    var inputPassword = $('#password')
    var inputConfirmPassword = $('#confirmPassword')
    var termsOfService = document.querySelector("#Input_TermsOfService")

    if (inputFirstName.val().length >= 2 && inputLastName.val().length >= 2 && inputEmail && inputPassword.val().length >= 8 && inputConfirmPassword.val().length >= 8 && termsOfService.checked) {
        button.removeClass('faded')
    } else {
        button.addClass('faded')
    }
}

function showModal() {
    $(modal).modal({ backdrop: 'static', keyboard: false })
}
function redirect(url) {
    document.location = url   
}