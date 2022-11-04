var modal = '#modalEmailConfirmation'

function handleMessage(message) {
    localStorage.setItem("message", message)
    build(message)
}

function build(message) {
    var src = message.isError.toUpperCase().includes('TRUE')?'/Images/alert.svg':'/Images/success_circle.svg'
    
    $('#modalEmailConfirmationLabel').html(message.title)
    $('#modalEmailConfirmationBody').html(message.body)    
    $('#modalEmailConfirmationButtonConfirm').html(message.procceedText)   
    $('#modalEmailConfirmationIcon').attr('src', src)
    
    if(message.goBackText) {
        $('#modalEmailConfirmationButtonBack').html(message.goBackText)   
    } else {
        $('#modalEmailConfirmationButtonBack').hide()
    }
    
    if(message.isError.toUpperCase().includes('FALSE')) {
        $('#modalEmailConfirmationButtonConfirm').on("click", function () {
            redirect("/Identity/Account/Login")
        })    
    }
    
    showModal()
}


function showModal() {
    $(modal).modal({ backdrop: 'static', keyboard: false })
}

function redirect(url) {
    document.location = url   
}