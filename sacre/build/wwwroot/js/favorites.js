var modalOptions = '#modalOptions'
var pageNumber
var totalNumber
var perpage
var lastPage

function redirect(url) {
    document.location = url
}

function BuscarFavoritos(page, perPage, search) {
    var url = `/favorite-funds/from-user/${localStorage.getItem('userId')}`

    var idstoremove = []

    let parameters = { removeids: idstoremove, requestDTO: { Page: page, PerPage: perPage }, filter: { Search: search } }

    $.get(url, parameters, function (response) {
        if (response.data) {

            fillTable(response.data)

            perpage = response.perPage
            pageNumber = response.currentPage
            lastPage = response.lastPage
            totalNumber = response.total

            fillPagination();
        }
    });
}

//Ajustar quando tiver o endpoint de busca de favoritos
function fillTable(datasource) {
    var table
    var corpo
    var favoritesTb = $('#favoritesTable')
    favoritesTb.html('')

    datasource?.map(function (item) {
        var cnpj = item.cnpj.toString();

        corpo += `
                <tr class="table-row" id="cons_${item?.class}" style="padding-top: 5px; padding-bottom: 5px; position: relative">
                    <td style="padding-left: 40px">
                        <div class="row" style="align-items: center; margin: 16px 16px 16px 0px">
                            <div href="#" rel="tooltip" data-placement="top" title="${item?.name}">
                                <div class="card-title">${item?.name.length > 15 ? item?.name.substring(0, 15) : item?.name}</div>
                            </div>
                        </div>
                    </td>
                    <td class="flex-item">${cnpj}</td>
                    <td class="flex-item">${item?.class}</td>
                    <td id="more" class="flex-item" onclick="showModalOptions(\`${cnpj}\`)"><img src="/Images/more_icon.svg" style="margin-left: 10px; width: 16px; height:16px"/></td>
                </tr>
                `
    })

    table = `
            <thead>
                <tr class="table-row">
                    <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Razão Social</div></th>
                    <th><div class="actives-table">CNPJ</div></th>
                    <th><div class="actives-table">Classe</div></th>
                    <th class="actives-table">Ações</th>
                </tr>
            </thead>
             ${corpo}`

    favoritesTb.append(table)
}

function showModalOptions(cnpj) {
    var modalHeader = $('#modalOptionsHeader')
    modalHeader.html('')
    modalHeader.append(`<div class="favorites-td" style="font-size: 12px; color: #A4B4CB">Ações</div>`)

    var modalBody = $('#modalOptionsBody')
    modalBody.html('')
    modalBody.append(`
        <div class="favorites-td" style = "color: #637692; display: flex; gap: 8px; align-items: center; cursor: pointer" onclick = "RemoverFavorito(\`${cnpj}\`)" > <img src="/Images/danger_icon.svg" style="margin-left: 10px; width: 16px; height:16px; filter: opacity(0.5) " />Remover dos Favoritos</div >
        <div class="favorites-td"><hr /></div>
        <div class="favorites-td" style="color: #637692; display: flex; gap: 8px; align-items: center; cursor: pointer" data-dismiss="modal"><img id="close" src="/Images/close_icon.svg" style="margin-left: 10px; width: 16px; height:16px"/>Fechar</div>
    `)

    $(modalOptions).modal({ backdrop: 'static', keyboard: false })
}

function RemoverFavorito(id) {
    var url = `/favorite-funds/delete?cnpj=${id}&userID=${localStorage.getItem('userId')}`

    $.ajax({
        url,
        type: 'DELETE',
    }).done(function (response) {
        if (response.status) {

            var x = $("#snackbar");
            x.toggleClass('show');

            $(modalOptions).modal('hide')

            BuscarFavoritos(pageNumber, totalNumber, $('#item_search').val())

        }
    });
}

function hideSnackBar() {
    var x = $("#snackbar");
    x.toggleClass("show");
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
        BuscarFavoritos(pageNumber, totalNumber, $('#item_search').val());
    }
}

function goToPage(pageNumber) {
    BuscarFavoritos(pageNumber, perpage, $('#item_search').val());
}

function nextPage() {
    if (pageNumber < totalNumber) {
        pageNumber++;
        BuscarFavoritos(pageNumber, totalNumber, $('#item_search').val());
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
                        <span style="color: #A4B4CB" onclick="BuscarFavoritos(1,5,'')">5</span>
                        <span style="color: #A4B4CB" onclick="BuscarFavoritos(1,10,'')">10</span>
                        <span style="color: #A4B4CB" onclick="BuscarFavoritos(1,15,'')">15</span>
                        <span style="color: #A4B4CB" onclick="BuscarFavoritos(1,30,'')">30</span>
                        <span style="color: #A4B4CB" onclick="BuscarFavoritos(1,${totalNumber},'')">Todos</span>
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
        if (page <= 0) {
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