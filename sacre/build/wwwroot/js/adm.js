/*var modal = '#modalIndicate'*/
var pageNumber
var totalNumber
var perpage
var lastPage

$(function () {
    BuscarRelatorios(1, 15, '')
})

function showToast() {
    var x = $("#snackbar");
    x.toggleClass('show');
}

function redirect(url) {
    document.location = url   
}

function BuscarRelatorios(page, perPage, search) {
    $.get(`/reports/viewed-funds?page=${page}&perPage=${perPage}&search=${search}`, function (response) {

        if (response.status) {

            pageNumber = page
            fillTable(response.data.data)

            perpage = perPage
            pageNumber = response.data.currentPage
            lastPage = response.data.lastPage
            totalNumber = response.data.total

            fillPagination();
        }
    })
}

function fillTable(datasource) {
    var table
    var corpo
    var favoritesTb = $('#reportsTable')
    favoritesTb.html('')

    datasource?.map(function (item) {
        corpo += `
                <tr class="table-row" id="cons_${item?.fundCnpj}" style="padding-top: 5px; padding-bottom: 5px; position: relative; border-top: 1px solid #ECF0F3">
                    <td style="padding-left: 40px">
                        <div class="row" style="align-items: center; margin: 16px 16px 16px 0px">
                            <div href="#" rel="tooltip" data-placement="top" title="${item?.email}">
                                <div class="card-title">${item?.email.length > 30 ? item?.email.substring(0, 30) + '...' : item?.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="row" style="align-items: center; margin: 16px 16px 16px 0px">
                            <div href="#" rel="tooltip" data-placement="top" title="${item?.fundName}">
                                <div class="card-title" style="font-weight: 400 !important">${item?.fundName.length > 15 ? item?.fundName.substring(0, 15) : item?.fundName}</div>
                            </div>
                        </div>
                    </td>
                    <td class="flex-item">${new Date(item.viewedAt).toLocaleDateString()}</td>
                    <td class="flex-item">${item.viewedAt.split('T')[1]?.split('.')[0]}</td>
                </tr>
                `
    })

    table = `
            <thead>
                <tr class="table-row">
                    <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">E-mail do usuario</div></th>
                    <th><div class="actives-table">Fundo pesquisado</div></th>
                    <th><div class="actives-table">Data da busca</div></th>
                    <th><div class="actives-table">Hora da busca</div></th>
                </tr>
            </thead>
             ${corpo}`

    favoritesTb.append(table)
}

function hideSnackBar() {
    var x = $("#snackbar");
    x.toggleClass("show");
}

function handleCsvDownload() {

    let userId = localStorage.getItem('userId')

    $.get(`/reports/json/viewed-funds?userId=${userId}`, function (response) {

        if (response) {
            var blob = new Blob([response], { type: 'text/json;charset=utf-8;' });
            if (navigator.msSaveBlob) { 
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { 
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", 'Dados ADM.json');
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
            showToast();
        }
    })
}

function handleDropdown() {
    var element = document.getElementById('dpdw-cnt')

    if (element.classList.contains('flexed')) {
        element.classList.remove('flexed');
        return;
    }

    element.classList.add('flexed');
}

function prevPage() {
    if (pageNumber > 1) {
        pageNumber--;
        BuscarRelatorios(pageNumber, perpage, '');
    }
}

function goToPage(pageNumber) {
    BuscarRelatorios(pageNumber, perpage, '');
}

function nextPage() {
    if (pageNumber < lastPage) {
        pageNumber++;
        BuscarRelatorios(pageNumber, perpage, '');
    }
}

function fillPagination() {
    var pagination = $('.pagination')
    pagination.html('')
    var viewNumber

    viewNumber = `<div>
                    <span style="color: #637692; font-weight: 600">Exibindo: </span>
                    <span style="color: #637692; font-weight: 600">${perpage >= totalNumber ? totalNumber : perpage} <img src="/Images/arrow_drop_down.svg" onclick="handleDropdown()"></span>
                    <span style="color: #A4B4CB">de ${totalNumber}</span >
                    <div id="dpdw-cnt" class="dropdown-pagination">
                        <span style="color: #A4B4CB" onclick="BuscarRelatorios(1,5,'')">5</span>
                        <span style="color: #A4B4CB" onclick="BuscarRelatorios(1,10,'')">10</span>
                        <span style="color: #A4B4CB" onclick="BuscarRelatorios(1,15,'')">15</span>
                        <span style="color: #A4B4CB" onclick="BuscarRelatorios(1,30,'')">30</span>
                        <span style="color: #A4B4CB" onclick="BuscarRelatorios(1,${totalNumber},'')">Todos</span>
                    </div>
                </div>`

    var { maxLeft, maxRight } = calculateMaxVisible()
    paginationButtons = `<div style="display: flex; flex-direction: row; gap: 8px">
                            <div id="numbers">
                                ${generateNumbers(maxLeft, maxRight)}
                            </div>
                        </div>`

    pagination.append(viewNumber + paginationButtons)
}

function generateNumbers(maxLeft, maxRight) {
    var paginationNumbers = $('.paginationNumbers')
    paginationNumbers.html('')
    pageNumber == 1 ? paginationNumbers.append('') : paginationNumbers.prepend(`<img src="./Images/button_left.svg" class="modal-button btn" id="btn_prev" onclick="prevPage()" style="width: 46px; height: 46px; border: 1px solid #E2E8F0; border-radius: 8px;"></img>`)

    for (let page = maxLeft; page <= maxRight; page++) {
        if (page > lastPage) {
            return ''
        }
        if (page < 0) {
            return ''
        }
        paginationNumbers.append(`<button class="modal-button btn ${page == pageNumber && "clicked"}" id="number" onclick="goToPage(${page})" style="width: 46px; height: 46px">${page}</button>`)
    }

    pageNumber >= lastPage ? paginationNumbers.append('') : paginationNumbers.append(`<img src="./Images/button_right.svg" class="modal-button btn" id="btn_next" onclick="nextPage()" style="width: 46px; height: 46px; border: 1px solid #E2E8F0; border-radius: 8px;"></img>`)
   
    return ''
}

function calculateMaxVisible() {
    let maxLeft = pageNumber - Math.floor(5 / 2)
    let maxRight = pageNumber + Math.floor(5 / 2)

    if (maxLeft < 1) {
        maxLeft = 1
        maxRight = 5
    }

    if (maxRight > totalNumber) {
        maxLeft = totalNumber - (5 - 1)
        maxRight = totalNumber
    }

    return { maxLeft, maxRight }
}