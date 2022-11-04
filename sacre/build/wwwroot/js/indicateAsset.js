var modal = '#modalIndicate'
var errorModal = '#modalErroCarregamentoDados'

function indicateAsset() {

    var assetList = JSON.parse(localStorage.getItem('indicateAssetList'))
    var userId = localStorage.getItem('userId')

    var url = '/nextlivefunds/add'

    let parameters = { cnpjList: assetList.map(asset => asset.cnpj), userId: userId || '' }

    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            if (response.status) {
                localStorage.setItem("indicateAssetList", null)
                fillIndicatedAssets()
                showModalSuccess()
            } else {
                showErrorModal()
            }
        }
    })
}

function showModalSuccess() {
    $(modal).modal({ backdrop: 'static', keyboard: false })
}

function showErrorModal() {
    $(errorModal).modal({ backdrop: 'static', keyboard: false })
}


function redirect(url) {
    document.location = url   
}

function neg2pos(val) { return Math.abs(val) }

function fillIndicatedAssets() {
    var ipvalue = $("#item_search").val().toUpperCase();
    var userId = localStorage.getItem("userId")
    var assetList = localStorage.getItem("indicateAssetList")
    
    if(assetList !== null && assetList !== 'null' && assetList !== 'undefined' && assetList != '[]') {

        AdicionarAtivos(1, 15, ipvalue.length >= 2?ipvalue:'');
        return;
    }

    if(!userId) return
    
    $.get(`/nextlivefunds/from-user/${userId}`, function(response) {
        if(response.data) {
            localStorage.setItem("indicateAssetList", JSON.stringify(response.data))
        }

        AdicionarAtivos(1, 15, ipvalue.length >= 2?ipvalue:'');
    })
}

function AdicionarAtivos(page, perPage, search) {    
    var url = '/FundsComparation/GetAllFounds'

    var idstoremove = []

    let parameters = { removeids: idstoremove, requestDTO: { Page: page, PerPage: perPage }, filter: { Search: search } }

    $.post(url, parameters, function (response) {

        if (response.status) {
            fillAssetsList(response.data)
        }
    });
}

function fillAssetsList(datasource) {
    var cardlist = $('#actives-list')
    var pagination = $('.pagination')
    pagination.html('')
    cardlist.html('')
    if (datasource != null && datasource.data != null) {
        if (!datasource.data.length) {
            var paraphase = `<div class="row">
                                Não existem ativos para serem listados
                            </div>`;
            return cardlist.append(paraphase)
        }

        localStorage.setItem('indicateAssetsObjJson', JSON.stringify(datasource.data))
        var assetList = localStorage.getItem('indicateAssetList');
        datasource.data.forEach(function (item) {
            var includes = assetList?.includes(item.cnpj);
            var checkBoxActive = includes ? 'checked' : '';

            let strTitle = item.name.trim()
            strTitle = strTitle.length > 15 ? strTitle.substr(0, 15) : strTitle

            let formattedClass = item.class.split('-')[0]

            let formattedCnpj = item.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")

            let positiveID = neg2pos(item.cnpj)

            var newCard = `<div class="card-indicate" id="card_${positiveID}" style="flex-direction: row">
                                <div class="row">
                                    <div class="retangle ${item.color}"></div>
                                    <div class="column">
                                        <div class="card-header" style="height: 50%">
                                            <div href="#" rel="tooltip" data-placement="top" title="${item.name}">
                                                <div class="row" style="width: 100%; align-items: center; justify-content: space-between" data-toggle="tooltip">
                                                    ${strTitle}
                                                </div>
                                            </div>
                                            <div class="cnpj">${formattedCnpj}</div>
                                        </div>

                                        <div class="card-body">
                                            <div class="modality">${formattedClass}</div>
                                        </div>
                                    </div>                   
                                </div>
                                <div style="padding-top: 10px">
                                    <label class="checkbox-input" onclick="itemClick(${positiveID})">
                                        <input id="ck_${positiveID}" class="checkbox-input" ${checkBoxActive ? "checked" : ""} type="checkbox" />
                                        <span class="checkmark"></span>
                                    </label>
                                </div>
                            </div>`
            cardlist.append(newCard)
        })

        var paginationButtons = `
            <button class="modal-button btn btn-secondary" id="btn_prev" onclick="prevPage()" style="width: 77px">Anterior</button>
            <button class="modal-button btn btn-secondary" id="btn_next" onclick="nextPage()" style="width: 77px">Próximo</button>`

        if ($('#item_search').val()) {
            pagination.append(paginationButtons)
        }
    }
}

function itemClick(id) {

    let isEnabled = !($(`#ck_${id}`).is(":disabled"))
    if (isEnabled) {
        let ischecked = Boolean($(`#ck_${id}`).is(":checked"))
        $(`#ck_${id}`).prop("checked", !ischecked)
        updateAssetList(id, !ischecked)
    } else {
        $(`#ck_${id}`).prop("checked", false)
    }
}

//receive cnpj(id) and checked status to add or remove from temporary list.
function updateAssetList(id, checked) {
    var assetList = JSON.parse(localStorage.getItem('indicateAssetList'))
    if (assetList == null) {
        assetList = []
    }
    if (checked) {
        const checkedObject = JSON.parse(localStorage.getItem('indicateAssetsObjJson'))?.find(function (item) {
            return item.cnpj.includes(id);
        })
        if (checkedObject) {
            var alreadyExists = assetList.find(function (item) {
                return item.cnpj.includes(id);
            })
            if (!alreadyExists) {
                assetList.push(checkedObject)
            }
        }
    } else {
        var alreadyExists = assetList.find(function (item) {
            return item.cnpj.includes(id);
        })
        if (alreadyExists) {
            assetList.splice(assetList.indexOf(alreadyExists), 1)
        }
    }

    localStorage.setItem('indicateAssetList', JSON.stringify(assetList));

}