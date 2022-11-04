var modalLogout = '#modalLogout'

function showModalLogout() {
    $('.search-assets').removeClass('search-fade');
    $(modalLogout).modal({ backdrop: 'static', keyboard: false })
}

function logout() {
    var url = "/auth/logout"
    if (localStorage.getItem('userId') != 'null') {
        $.post(url, {}, function (response) {
            if (response.status) {
                localStorage.setItem('userId', null)
                return location.reload()
            }
        });
    }
}

$(function () {
    $('#modalLogoutButtonBack').on('click', function () { $('.search-assets').removeClass('search-fade'); })
    $('#modalLogoutButtonConfirm').on('click', function () { $('.search-assets').removeClass('search-fade'); })
})

function handleDropDown() {
    var element = document.getElementById('drpdwn-cnt')

    if (element.classList.contains('flexed')) {
        element.classList.remove('flexed');
        return;
    }

    element.classList.add('flexed');
}
