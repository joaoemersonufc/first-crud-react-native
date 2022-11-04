$(document).ready(function () {
    fillFavoritedFunds()
    localStorage.setItem('assetList', null);
    localStorage.setItem('assetModalSearch', null);
    localStorage.setItem('globalAssetList', null);
});

function formatPatrimony(patrimony) {
    
    item?.patrimony.toString().replace('.', ',')
    return undefined;
}

function detalharFundo(id, color) {
    localStorage.setItem('fundDetailColor', color)
    document.location = `/FundDetail?id=${id}`
}
//Adjust when the endpoint of favorite funds is complete 
function fillFavoritedFunds() {
    var startTitle = `<h2>Fundos em Destaque</h2>`

    $.get(`/popular-funds/detailed`, function (response) {
        if (response.data) {
            var popularFundsResponse = response.data

            var fundslist = $('#assets-to-compare')
            var title = $('.title-label')
            fundslist.html('')
            title.html('')
            if (popularFundsResponse != null) {

                popularFundsResponse.forEach(function (item) {

                    let strTitle = item.name.trim()
                    strTitle = strTitle.length > 15 ? strTitle.substr(0, 15) : strTitle

                    let formattedClass = item.class.split('-')[0]

                    let formattedCnpj = item.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")

                    let positiveID = neg2pos(item.cnpj)

                    let formatedProfitability = item?.profitability.toString().replace('.', ',')

                    var newCard = `<div class="card similar-founds" style="border-radius: 10px">
                                    <div class="row">
                                        <div class="retangle-similar ${item.color}">
                                        </div>
                                        <script type="text/javascript">
                                            $(function () {
                                                $("[rel='tooltip']").tooltip();
                                            });
                                        </script>
                                        <div class="column mouseclick" style="min-width: 245px">
                                            <div class="card-header" style="cursor: pointer">
                                                <div href="#" rel="tooltip" data-placement="top" title="${item.name}" onclick="detalharFundo(\`${item.cnpj}\`, \`${item.color}\`)">
                                                    <div class="row" style="width: 100%; align-items: center; justify-content: space-between; color: #1E293B; font-weight: 500" data-toggle="tooltip">
                                                        ${strTitle}
                                                    </div>
                                                </div>
                                                <div href="#" rel="tooltip" data-placement="top" title="${positiveID}">
                                                    <div class="row" style="width: 100%; align-items: center; justify-content: space-between; color: #637692" data-toggle="tooltip">
                                                        ${formattedCnpj}
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="card-body">
                                                <div class="modality">${formattedClass}</div>

                                                <div class="row-inside">
                                                    <div class="divider">
                                                        <a class="rentability ${item?.profitability < 0 ? "red-percent" : "normal-percent"}">${formatedProfitability}%</a>
                                                        <p>Rent. 12 Meses</p>
                                                    </div>

                                                    <div class="divider">
                                                        <a style="font-weight: 600; color: #1E293B">R$ ${maskYaxis(item?.patrimony)}</a>
                                                        <p>Patrimônio Líquido</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    fundslist.append(newCard)
                })
                title.append(startTitle)
            }
        }
    })
}

function neg2pos(val) { return Math.abs(val) }

function BuscarAtivos(page, perPage, search) {
    $("#last-viewed-funds-title").remove();
    $('#last-viewed-funds-list').remove();
    var assetList = localStorage.getItem("assetList")
    if (!assetList || assetList == 'null') {
        localStorage.setItem("assetList", localStorage.getItem("globalAssetList"))
    }

    var url = '/FundsComparation/GetAllFounds'

    if (page < 1) page = 1

    localStorage.setItem('currentPage', page)

    var idstoremove = []

    let parameters = { removeids: idstoremove, requestDTO: { Page: page, PerPage: perPage }, filter: { Search: search } }

    $.post(url, parameters, function (response) {

        if (response.status) {

            OpenModalById('#modalBuscarAtivos');

            fillSearchAssetsModal(response.data)

            let numb = getAssetListCount()

            var notchk = $("input:checkbox:not(:checked)")

            if (numb > 5) {
                for (var i = 0; i < notchk.length; i++) {
                    $(`#${notchk[i].id}`).prop("disabled", true);
                }
            }
        }
    });
}

function fillSearchAssetsModal(datasource) {
    var cardlist = $('#actives-list')
    var pagination = $('#pagination')
    pagination.html('')
    cardlist.html('')
    if (datasource != null && datasource.data != null) {
        if (!datasource.data.length) {
            var paraphase = `<div class="row">
                                Não existem ativos para serem listados
                            </div>`;
            return cardlist.append(paraphase)
        }

        localStorage.setItem('objJson', JSON.stringify(datasource.data))

        var assetList = localStorage.getItem('assetList');

        datasource.data.forEach(function (item) {
            var includes = assetList.includes(item.cnpj);
            var checkBoxActive = includes ? 'checked' : '';

            let strTitle = item.name.trim()
            strTitle = strTitle.length > 15 ? strTitle.substr(0, 15) : strTitle

            let formattedClass = item.class.split('-')[0]

            let formattedCnpj = item.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")

            let positiveID = neg2pos(item.cnpj)

            var newCard = `<div class="card home-assets-card" id="card_${positiveID}" style="flex-direction: row; border-radius: 10px">
                                <div class="row">
                                    <div class="retangle ${item.color} home-card-retangle"></div>
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

        if ($('#item-search').val()) {
            pagination.append(paginationButtons)
        }
    }
}

function itemClick(id) {
    var chk = getAssetListCount()
    if (chk >= 5) {
        var assetList = JSON.parse(localStorage.getItem('assetList'));
        if (assetList && assetList != 'null') {
            var alreadyExists = assetList.find(function (item) {
                return item.cnpj.includes(id);
            })
            if (!alreadyExists) {

                $(`#ck_${id}`).prop("checked", false)
                return;
            }
        }
    }


    let isEnabled = !($(`#ck_${id}`).is(":disabled"))
    // * Verifica se já marcou(check) o limite de ativos = 5
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
    var assetList = JSON.parse(localStorage.getItem('assetList'))
    if (assetList == null) {
        assetList = []
    }
    if (checked) {
        const checkedObject = JSON.parse(localStorage.getItem('objJson'))?.find(function (item) {
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

    localStorage.setItem('assetList', JSON.stringify(assetList));
}

function countVerifyChecked() {
    var chk = getAssetListCount()

    var notchk = $("input:checkbox:not(:checked)")

    if (chk > 5) {
        for (var i = 0; i < notchk.length; i++) {

            let name = notchk[i].id.replace('ck_', '')
            let cardname = `card_${name}`

            $(`#${cardname}`).prop("disabled", true);
            $(`#${cardname}`).find("*").prop("disabled", true);
            $(`#${notchk[i].id}`).prop("disabled", true);
        }
    } else {
        for (var i = 0; i < notchk.length; i++) {
            $(`#${notchk[i].id}`).prop("disabled", false);
        }
    }
}

function getAssetListCount() {
    var assetList = JSON.parse(localStorage.getItem('assetList'));
    if (!assetList || assetList == 'null') return 0;
    return assetList.length;
}

function clearAssetList() {
    localStorage.setItem('assetList', null);
    localStorage.setItem('assetModalSearch', null);
    $('#item-search').val('');
    BuscarAtivos(1, 15, '');
}

function addItemsSave() {
    var assetList = JSON.parse(localStorage.getItem('assetList'))
    if (assetList) {
        var cnpjList = []
        assetList.forEach(function (asset) {
            cnpjList.push(asset.cnpj);
        })
    }
    //clear assetList and persist to global
    localStorage.setItem('globalAssetList', JSON.stringify(assetList));

    clearAssetList();

    if (cnpjList.length == 1) {

        detalharFundo(cnpjList, 'black')

    } else {

        CallSaveFunds(cnpjList);

        redirectToComparation();
    }

    $('#item-search').val('');
}

function maskYaxis(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: " k" },
        { value: 1e6, symbol: " mi" },
        { value: 1e9, symbol: " bi" },
        { value: 1e12, symbol: " tri" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

function CallSaveFunds(cnpjList) {
    saveNewFunds(cnpjList);
}

function saveNewFunds(cnpjFunds, filterType, initialDate, finalDate) {
    var userId = localStorage.getItem("userId");
    if (!userId || userId === 'null' || userId === 'undefined') {
        userId = "";
    }

    let parameters = { CnpjFunds: cnpjFunds, FilterType: filterType ? filterType : 0, InitialDate: initialDate ? initialDate : "", FinalDate: finalDate ? finalDate : "", AddFunds: true, UserId: userId }
    let url = "/FundsComparation/Save"
    $.post(url, parameters, function (response) {
        if (response.status) {

            localStorage.setItem('fundsResponse', JSON.stringify(response.data))
            LoadingOFF()
        }
    });
}

function redirectToComparation() {
    document.location = `/FundsComparation`
}