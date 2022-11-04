var modal = '#modalRecover'

function handleMessage(message) {
    localStorage.setItem("message", message)
    build(message)
}

function build(message) {
    var src = message.isError.toUpperCase().includes('TRUE')?'/Images/alert.svg':'/Images/success_circle.svg'
    
    $('#modalRecoverLabel').html(message.title)
    $('#modalRecoverBody').html(message.body)    
    $('#modalRecoverButtonConfirm').html(message.procceedText)   
    $('#modalRecoverIcon').attr('src', src)
    
    if(message.goBackText) {
        $('#modalRecoverButtonBack').html(message.goBackText)   
    } else {
        $('#modalRecoverButtonBack').hide()
    }
    
    if(message.isError.toUpperCase().includes('FALSE')) {
        $('#modalRecoverButtonConfirm').on("click", function () {
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