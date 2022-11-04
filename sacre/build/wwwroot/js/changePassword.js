var modal = '#modalChange'

function handleMessage(message) {
    localStorage.setItem("message", message)
    build(message)
}

function build(message) {
    var src = message.isError.toUpperCase().includes('TRUE')?'/Images/alert.svg':'/Images/success_circle.svg'
    
    $('#modalChangeLabel').html(message.title)
    $('#modalChangeBody').html(message.body)    
    $('#modalChangeButtonConfirm').html(message.procceedText)   
    $('#modalChangeIcon').attr('src', src)
    
    if(message.goBackText) {
        $('#modalChangeButtonBack').html(message.goBackText)   
    } else {
        $('#modalChangeButtonBack').hide()
    }
    
    if(message.isError.toUpperCase().includes('FALSE')) {
        $('#modalChangeButtonConfirm').on("click", function () {
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