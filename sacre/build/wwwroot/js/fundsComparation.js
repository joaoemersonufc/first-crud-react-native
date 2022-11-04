
var graficoRiscoRetorno = []
var graficoCotistas = []
var graficoDrawdown = []
var graficoPatrimonio = []
var graficoVolatilidade = []
var graficoColors = []
var dados = {}
var cdiChecked = false
var dolarChecked = false
var ibovespaChecked = false
var ipcaChecked = false
var igpmChecked = false
var selicChecked = false

var colorsWithIds = []

var modalNotMatch = '#modalNotMatch'

// * GRAFICO DE RENTABILIDADE
var rentabilOptions = {
    chart: {
        type: 'line',
        zoom: {
            enabled: false,
        },
        height: 400 
    },
    legend: {
        formatter: (seriesName) => {
            let assetName = ''

            if (seriesName.length > 15) {
                assetName = seriesName.toString().substring(0, 15)
            } else {
                assetName = seriesName
            }
            return assetName
        },
    },
    markers: {
        showNullDataPoints: true,
    },
    tooltip: {
        y: {
            formatter: function (value) {
                const formattedValue = value?.toFixed(2)?.replace('.', ',')
                if (!formattedValue) {
                    return '--'
                }
                return formattedValue + '% -';
            },
            title: {
                formatter: (seriesName) => seriesName,
            }
        },
    },
    yaxis: {
        labels: {
            formatter: (value) => value.toFixed(0) + '%',
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth',
    },
    series: [],
    xaxis: {
        type: "datetime",
        labels: {
            formatter: function (e) {
                var value = new Date(e).toLocaleDateString().split('/')[1] + '-' + new Date(e).toLocaleDateString().split('/')[2].substring(2, 4);
                if (value == '12-69') return '';

                return value;
            }
        }
    }
}

// * GRAFICO RISCO x RETORNO
var riscoRetornoOptions = {
    series: [],
    chart: {
        type: 'scatter',
        zoom: {
            enabled: false,
        }
    },
    legend: {
        formatter: (seriesName) => {
            let assetName = ''

            if (seriesName.length > 15) {
                assetName = seriesName.toString().substring(0, 15)
            } else {
                assetName = seriesName
            }
            return assetName
        },
    },
    tooltip: {
        y: {
            formatter: (value) => value?.toFixed(2).replace('.', ','),
        },
    },
    yaxis: {
        title: {
            text: 'Retorno',
            style: {
                color: '#637692',
                fontSize: '12px',
                fontWeight: 400,
            },
        },
        labels: {
            formatter: (value) => value.toFixed(2).replace('.', ','),
        }
    },
    xaxis: {
        tickAmount: 10,
        title: {
            text: 'Risco',
            style: {
                color: '#637692',
                fontSize: '12px',
                fontWeight: 400,
            },
        },
        labels: {
            formatter: (value) => value.toFixed(2).replace('.', ','),
        },
    },
}

// * GRAFICO COTISTAS
var cotistasOptions = {
    chart: {
        type: 'line',
        zoom: {
            enabled: false,
        }
    },
    legend: {
        formatter: (seriesName) => {
            let assetName = ''

            if (seriesName.length > 15) {
                assetName = seriesName.toString().substring(0, 15)
            } else {
                assetName = seriesName
            }
            return assetName
        },
    },
    tooltip: {
        y: {
            formatter: function (value) {
                return value?.toFixed(0).replace('.', ',');
            },
            title: {
                formatter: (seriesName) => seriesName,
            }
        },
    },
    yaxis: {
        title: {
            text: 'Cotistas',
            style: {
                color: '#637692',
                fontSize: '12px',
                fontWeight: 400,
            },
        },
        labels: {
            formatter: function (value) {
                if (value > 1000) {
                    return maskYaxis(value, value.toString().length);
                }
                return value.toFixed(0);
            },
        }
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    series: [],
    xaxis: {
        type: "datetime",
        labels: {
            formatter: function (e) {
                var value = new Date(e).toLocaleDateString().split('/')[1] + '-' + new Date(e).toLocaleDateString().split('/')[2].substring(2, 4);
                if (value == '12-69') return '';

                return value;
            }
        }
    }
}

// * GRAFICO DRAWDOWN
var drawdownOptions = {
    chart: {
        type: 'line',
        zoom: {
            enabled: false,
        }
    },
    legend: {
        formatter: (seriesName) => {
            let assetName = ''

            if (seriesName.length > 15) {
                assetName = seriesName.toString().substring(0, 15)
            } else {
                assetName = seriesName
            }
            return assetName
        },
    },
    tooltip: {
        y: {
            formatter: function (value) {
                return value?.toFixed(2).replace('.', ',');
            },
            title: {
                formatter: (seriesName) => seriesName,
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    yaxis: {
        labels: {
            formatter: (value) => value.toFixed(2).replace('.', ',') + '%',
        }
    },
    series: [],
    xaxis: {
        type: "datetime",
        labels: {
            formatter: function (e) {
                var value = new Date(e).toLocaleDateString().split('/')[1] + '-' + new Date(e).toLocaleDateString().split('/')[2].substring(2, 4);
                if (value == '12-69') return '';

                return value;
            }
        }
    }
}

// * GRAFICO PATRIMONIO
var patrimonioOptions = {
    chart: {
        type: 'line',
        zoom: {
            enabled: false,
        }
    },
    legend: {
        formatter: (seriesName) => {
            let assetName = ''

            if (seriesName.length > 15) {
                assetName = seriesName.toString().substring(0, 15)
            } else {
                assetName = seriesName
            }
            return assetName
        },
    },
    tooltip: {
        y: {
            formatter: function (value) {
                return 'R$ ' + value?.toFixed(0).replace('.', ',') + ' -';
            },
            title: {
                formatter: (seriesName) => seriesName,
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                if (value > 1000) {
                    return 'R$ ' + maskYaxis(value, value.toString().length);
                }
                return 'R$ ' + value.toFixed(0);
            },
        }
    },
    series: [],
    xaxis: {
        type: "datetime",
        labels: {
            formatter: function (e) {
                var value = new Date(e).toLocaleDateString().split('/')[1] + '-' + new Date(e).toLocaleDateString().split('/')[2].substring(2, 4);
                if (value == '12-69') return '';

                return value;
            }
        }
    }
}

// * GRAFICO VOLATILIDADE
var volatilidadeOptions = {
    chart: {
        type: 'line',
        zoom: {
            enabled: false,
        }
    },
    legend: {
        formatter: (seriesName) => {
            let assetName = ''

            if (seriesName.length > 15) {
                assetName = seriesName.toString().substring(0, 15)
            } else {
                assetName = seriesName
            }
            return assetName
        },
    },
    tooltip: {
        y: {
            formatter: function (value) {
                return value?.toFixed(2).replace('.', ',') + '% -';
            },
            title: {
                formatter: (seriesName) => seriesName,
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    yaxis: {
        labels: {
            formatter: (value) => value.toFixed(2).replace('.', ',') + '%' ,
        }
    },
    series: [],
    xaxis: {
        type: "datetime",
        labels: {
            formatter: function (e) {
                var value = new Date(e).toLocaleDateString().split('/')[1] + '-' + new Date(e).toLocaleDateString().split('/')[2].substring(2, 4);
                if (value == '12-69') return '';

                return value;
            }
        }
    }
}

function getHexColor(colorStr) {
    var a = document.createElement('div');
    a.style.color = colorStr;
    var colors = window.getComputedStyle(document.body.appendChild(a)).color.match(/\d+/g).map(function (a) { return parseInt(a, 10); });
    document.body.removeChild(a);
    return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
}

$(window).on("unload", function () {
    Unload()
})

function Unload() {
    dados = {}
}

function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}

function loadAssetCards() {

    // Instantiation
    var cardsList = $('#cards-list')
    cardsList.html('')
    var assetList = JSON.parse(localStorage.getItem('globalAssetList'))

    if (assetList) {
        assetList.forEach(function (item) {
            let strTitle = item.name.trim()
            strTitle = strTitle.length > 15 ? strTitle.substr(0, 15) : strTitle

            let formattedClass = item.class.split('-')[0]

            let formattedCnpj = item.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")

            if (!JSON.parse(localStorage.getItem('itemColors'))?.find(item => item.cnpj == item.id)) {
                colorsWithIds.push({ id: item.cnpj, color: item.color })
            }

            var newCard = `<div id="${item.cnpj}" class="card" style="min-width: fit-content">
                            <div class="row">
                                <div class="retangle ${item.color}">
                                </div>

                                <script type="text/javascript">
                                    $(function () {
                                        $("[rel='tooltip']").tooltip();
                                    });
                                </script>

                                <div class="column mouseclick">
                                    <div class="card-header">
                                        <div href="#" rel="tooltip" data-placement="top" title="${item.name.trim()}" onclick="detalharFundo(\`${item.cnpj}\`, \`${item.color}\`)">
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
                                <div style="padding-top: 10px; padding-right: 10px">
                                        <img src="/Images/button_close.svg" class="img-delete" style="width: 24px; height: 24px" onclick="removeAsset(\`${item.cnpj}\`)">
                                </div>
                            </div>
                        </div>`
            cardsList.prepend(newCard)
        })
    }

    localStorage.setItem("itemColors", JSON.stringify(colorsWithIds))

    var defaultCard = `<div class="card" style="min-width: 210px">
            <div class="row" style="align-items: center; padding-top:15px">
                <div class="retangle" style="background: #B1A082">
                </div>

                <div class="column btn" style="width: 90%">
                    <button type="button" id="btnAdicionar" class="btn-modal" onclick="fillModalType()">
                        <div class="row" style="width: 100%; align-items: center; justify-content: space-between">
                            Adicionar Ativo
                            <img src="/Images/button_add.svg" style="width: 24px; height: 24px">
                        </div>
                    </button>
                </div>
            </div>
        </div>`
    cardsList.append(defaultCard)
}

$(document).ready(function () {
    loadAssetCards();

    var indexes = ['otimo', '1ano', '2anos', 'personalizado']

    var assetList = JSON.parse(localStorage.getItem('globalAssetList'))
    var cnpjs = []
    if (assetList) {
        assetList.forEach(function (item) { cnpjs.push(item.cnpj) })
    }

    var filterInStorage = indexes.indexOf(localStorage.getItem('filterChecked'))

    var hasFilter = filterInStorage && filterInStorage != -1 ? filterInStorage : 0
    LoadingON()
    saveNewFunds(cnpjs, hasFilter)

    if (localStorage.getItem('cdiChecked') == 'null' || !localStorage.getItem('cdiChecked')) {
        localStorage.setItem('cdiChecked', true)
    }

    var newFundsResponseObj = JSON.parse(localStorage.getItem('fundsResponse'))
    dados = JSON.parse(localStorage.getItem('fundsResponse'))

    renderIndexes()
    renderFilters()

    var hasClick = []
    for (var i = 0; i < indexes.length; i++) {
        hasClick.push($(`#${indexes[i]}`).hasClass('clicked'))
    }

    if (!hasClick.includes(true)) {
        $(`#otimo`).toggleClass('clicked', true)
    }

    if (newFundsResponseObj != null) {
        carregarGraficos(newFundsResponseObj)
        carregaTableHistorico(newFundsResponseObj)
        carregaTableIndice(newFundsResponseObj)
        carregaTableConsistencia(newFundsResponseObj)
        carregaTableVolatilidade(newFundsResponseObj)
        carregaTableCorrelacao(newFundsResponseObj)
        defineTitulos(newFundsResponseObj)
        carregarCores(newFundsResponseObj)
    }
});

$(window).on("load", function () {
    //* Fecha a janela carregando ...   
    LoadingOFF()
});

function renderIndexes() {

    cdiChecked = JSON.parse(localStorage.getItem(`cdiChecked`))
    dolarChecked = JSON.parse(localStorage.getItem(`dolarChecked`))
    ibovespaChecked = JSON.parse(localStorage.getItem(`ibovespaChecked`))
    ipcaChecked = JSON.parse(localStorage.getItem(`ipcaChecked`))
    igpmChecked = JSON.parse(localStorage.getItem(`igpmChecked`))
    selicChecked = JSON.parse(localStorage.getItem(`selicChecked`))

    var indexes = [[cdiChecked, 'cdi'], [ibovespaChecked, 'ibovespa'], [dolarChecked, 'dolar'], [ipcaChecked, 'ipca'], [igpmChecked, 'igpm'], [selicChecked, 'selic']]

    var indexElements = ['rh_-', 'cons_-', 'is_-', 'vol_-']

    for (var i = 0; i < indexes.length; i++) {
        var realIndex = i + 1

        $(`#${indexes[i][1]}`).toggleClass('clicked', indexes[i][0] != null ? indexes[i][0] : false)

        indexElements.forEach(function (indexElements) {
            if (indexes[i][0] !== null && indexes[i][0]) {
                $(`#${indexElements + realIndex}`).show();
            } else {
                $(`#${indexElements + realIndex}`).hide();
            }
        })
    }

    dados = JSON.parse(localStorage.getItem('fundsResponse'))
    if (dados != null) { carregaTableCorrelacao(dados) }
    
}

function renderFilters() {

    var indexes = ['otimo','1ano', '2anos', 'personalizado']

    for (var i = 0; i < indexes.length; i++) {
        $(`#${indexes[i]}`).toggleClass('clicked', false)
    }

    filterChecked = localStorage.getItem(`filterChecked`)

    $(`#${filterChecked}`).toggleClass('clicked', true)

    dados = JSON.parse(localStorage.getItem('fundsResponse'))
    if (dados != null) { carregaTableCorrelacao(dados) }

}

function handleClickIndex(type) {
    var indexTypes = ['cdi', 'dolar', 'ibovespa', 'ipca', 'igpm', 'selic']

    if (indexTypes.includes(type)) {
        var checked = JSON.parse(localStorage.getItem(`${type}Checked`))
        if (checked != null) {
            localStorage.setItem(`${type}Checked`, !checked)
        } else {
            localStorage.setItem(`${type}Checked`, true)
        }
    }

    var newFundsResponseObj = JSON.parse(localStorage.getItem('fundsResponse'))
    if (newFundsResponseObj != null) {
        carregaTableCorrelacao(newFundsResponseObj)
    }

    renderIndexes()

    if (dados != {}) {
        carregarGraficos(dados)
    }
}

function handleClick(type) {

    var element = document.getElementById('dropdown-cont')
    element.classList.remove('flexed');

    var indexTypes = ['otimo','1ano', '2anos', 'personalizado']
    var globalAssetList = JSON.parse(localStorage.getItem('globalAssetList'));

    if (indexTypes.includes(type)) {
        var checked = localStorage.getItem('filterChecked')

        if (checked === type) {
            localStorage.setItem(`filterChecked`, null)
        } else {
            localStorage.setItem(`filterChecked`, type)
        }

        let cnpjs = []
        Array.from(globalAssetList)?.map(function (asset) {
            cnpjs.push(asset.cnpj);
        })

        if (type == 'personalizado') {
            var startDate = document.getElementById("initial_date").value;
            var finalDate = document.getElementById("final_date").value;

            saveNewFunds(cnpjs, indexTypes.indexOf(type), startDate, finalDate)
        } else {
            saveNewFunds(cnpjs, indexTypes.indexOf(type))
        }

    }

    var newFundsResponseObj = JSON.parse(localStorage.getItem('fundsResponse'))
    if (newFundsResponseObj != null) {
        carregaTableCorrelacao(newFundsResponseObj)
    }

    renderFilters()

    if (dados != {}) {
        carregarGraficos(dados)
    }
}

function carregarCores(datasource) {
    graficoColors = []

    if (datasource) {
        Array.from(datasource).map(function (item) {
            var hexColor = getHexColor(item.color)
            graficoColors.push(hexColor)
        })
    }
}

function carregarDadosGraficoRentabilidade(datasource) {
    var graficoRentabil = []
    var colorsGraph = []
    if (datasource) {
        Array.from(datasource).map(function (item) {
            if (item.profitability != null) {
                var data = []
                item.profitability?.map(function (profit) {
                    var y = profit.value.toString();
                    var x = new Date(profit.date).getTime();
                    data.push({ x: x, y: y })
                });

                let newSerie = {
                    name: item.fund.title,
                    type: "line",
                    data: data
                }


                if (item.fund.id >= 0) {

                    colorsGraph.push(item.color)
                    graficoRentabil.push(newSerie)
                }
                else if (item.fund.id == -1 && cdiChecked) {

                    colorsGraph.push(item.color)
                    graficoRentabil.push(newSerie)
                }
                else if (item.fund.id == -2 && ibovespaChecked) {

                    colorsGraph.push(item.color)
                    graficoRentabil.push(newSerie)
                }
                else if (item.fund.id == -3 && dolarChecked) {

                    colorsGraph.push(item.color)
                    graficoRentabil.push(newSerie)
                }
                else if (item.fund.id == -4 && ipcaChecked) {

                    colorsGraph.push(item.color)
                    graficoRentabil.push(newSerie)
                }
                else if (item.fund.id == -5 && igpmChecked) {

                    colorsGraph.push(item.color)
                    graficoRentabil.push(newSerie)
                }
                else if (item.fund.id == -6 && selicChecked) {

                    colorsGraph.push(item.color)
                    graficoRentabil.push(newSerie)
                }
            }
        })

        let dash = [];
        let indexCDI = graficoRentabil.findIndex(graph => graph.name === 'CDI')
        let indexDolar = graficoRentabil.findIndex(graph => graph.name === 'DOLAR')
        let indexIbovespa = graficoRentabil.findIndex(graph => graph.name === 'IBOVESPA')
        let indexIPCA = graficoRentabil.findIndex(graph => graph.name === 'IPCA')
        let indexIGPM = graficoRentabil.findIndex(graph => graph.name === 'IGPM')
        let indexSelic = graficoRentabil.findIndex(graph => graph.name === 'SELIC')

        let indexes = [indexCDI, indexDolar, indexIbovespa, indexIPCA, indexIGPM, indexSelic]

        for (let i = 0; i <= graficoRentabil.length; i++) {
            if (indexes.includes(i)) {
                dash.push(2)
                continue
            }
            dash.push(0)
        }

        // * Render ApexChart Graphic
        rentabilChart.updateSeries(graficoRentabil)
        if (colorsGraph.length > 0) { rentabilChart.updateOptions({ colors: colorsGraph.map(color => getHexColor(color)) }) }
        rentabilChart.updateOptions({
            xaxis: {
                type: 'datetime',
            },    
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetY: 0,
                itemMargin: {
                    horizontal: 5,
                    vertical: 0
                },
            },
            stroke: {
                dashArray: dash
            },
            tooltip: {
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const hoverXaxis = w?.globals.seriesX[seriesIndex][dataPointIndex];
                    const hoverIndexes = w?.globals.seriesX.map(seriesX => {
                        return seriesX.findIndex(xData => xData === hoverXaxis);
                    });

                    let hoverList = '';
                    hoverIndexes.forEach((hoverIndex, seriesEachIndex) => {
                        let assetName = ''
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            if (w?.globals.seriesNames[seriesEachIndex].length > 15) {
                                assetName = w?.globals.seriesNames[seriesEachIndex].toString().substring(0, 15) + '...'
                            } else {
                                assetName = w?.globals.seriesNames[seriesEachIndex]
                            }
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">${(series[seriesEachIndex][hoverIndex]).toString().replace('.', ',')}% - ${assetName}</span><br />`;
                        }
                    });
                    const formatHoverX = new Date(hoverXaxis).toLocaleDateString();

                    if (formatHoverX == 'Invalid Date') {
                        return '';
                    }

                    return `<div class=tooltip">
                                <div class="tooltip-header">${formatHoverX}</div>
                                <div class="tooltip-body">
                                    ${hoverList}
                                </div>
                            </div>`;
                },
            }
        })
    }
}

function carregarDadosRetornoRisco(datasource) {
    graficoRiscoRetorno = []
    var colorsGraph = []
    if (datasource) {
        Array.from(datasource)?.map(function (item) {

            var data = []
            var y = item.riskReturn?.profitability;
            var x = item.riskReturn?.sharpeIndex;
            data.push([x,y])
            let newSerie = {
                name: item.fund.title,
                data: data
            }
            colorsGraph.push(item.color)

            if (item.fund.id >= 0) {
                graficoRiscoRetorno.push(newSerie)
            }
            else if (item.fund.id == -1 && cdiChecked) {
                graficoRiscoRetorno.push(newSerie)
            }
            else if (item.fund.id == -2 && ibovespaChecked) {
                graficoRiscoRetorno.push(newSerie)
            }
            else if (item.fund.id == -3 && dolarChecked) {
                graficoRiscoRetorno.push(newSerie)
            }
            else if (item.fund.id == -4 && ipcaChecked) {
                graficoRiscoRetorno.push(newSerie)
            }
            else if (item.fund.id == -5 && igpmChecked) {
                graficoRiscoRetorno.push(newSerie)
            }
            else if (item.fund.id == -6 && selicChecked) {
                graficoRiscoRetorno.push(newSerie)
            }
        })

        // * Render ApexChart Graphic
        riscoRetornoChart.updateSeries(graficoRiscoRetorno)
        if (colorsGraph.length > 0) { riscoRetornoChart.updateOptions({ colors: colorsGraph.map(color => getHexColor(color)) }) }
        riscoRetornoChart.updateOptions({
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetY: 0,
                itemMargin: {
                    horizontal: 5,
                    vertical: 0
                },
            },
            tooltip: {
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const hoverXaxis = w?.globals.seriesX[seriesIndex][dataPointIndex];
                    const hoverIndexes = w?.globals.seriesX.map(seriesX => {
                        return seriesX.findIndex(xData => xData === hoverXaxis);
                    });

                    let hoverList = '';
                    let formatHoverX = '';
                    hoverIndexes.forEach((hoverIndex, seriesEachIndex) => {
                        let assetName = ''
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            if (w?.globals.seriesNames[seriesEachIndex].length > 15) {
                                assetName = w?.globals.seriesNames[seriesEachIndex].toString().substring(0, 15) + '...'
                            } else {
                                assetName = w?.globals.seriesNames[seriesEachIndex]
                            }
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">${assetName}</span><br />`;

                            formatHoverX = (series[seriesEachIndex][hoverIndex]).toString().replace('.', ',')
                        }
                    });

                    return `<div class=tooltip">
                                <div class="tooltip-header">Retorno: ${formatHoverX}%, Risco: ${hoverXaxis.toFixed(2).replace('.', ',')}%</div>
                                <div class="tooltip-body">
                                    ${hoverList}
                                </div>
                            </div>`;
                },
            }
        })
    }
}

function carregarDadosCotistas(datasource) {
    graficoCotistas = []
    var colorsGraph = []

    if (datasource) {
        Array.from(datasource)?.map(function (item) {
            var data = []
            if (item.shareholders !== null) {
                item.shareholders.map(function (share) {
                    var y = share.value.toFixed(2);
                    var x = new Date(share.date).getTime();
                    data.push({ x: x, y: y })
                });

                colorsGraph.push(item.color)

                let newSerie = {
                    name: item.fund.title,
                    type: "line",
                    data: data
                }
                if (item.fund.id >= 0) {
                    graficoCotistas.push(newSerie)
                }

            }
        })

        // * Render ApexChart Graphic
        cotistasChart.updateSeries(graficoCotistas)
        if (colorsGraph.length > 0) { cotistasChart.updateOptions({ colors: colorsGraph.map(color => getHexColor(color)) }) }
        cotistasChart.updateOptions({
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetY: 0,
                itemMargin: {
                    horizontal: 5,
                    vertical: 0
                },
            }, tooltip: {
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const hoverXaxis = w?.globals.seriesX[seriesIndex][dataPointIndex];
                    const hoverIndexes = w?.globals.seriesX.map(seriesX => {
                        return seriesX.findIndex(xData => xData === hoverXaxis);
                    });

                    let hoverList = '';
                    hoverIndexes.forEach((hoverIndex, seriesEachIndex) => {
                        let assetName = ''
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            if (w?.globals.seriesNames[seriesEachIndex].length > 15) {
                                assetName = w?.globals.seriesNames[seriesEachIndex].toString().substring(0, 15) + '...'
                            } else {
                                assetName = w?.globals.seriesNames[seriesEachIndex]
                            }
                            var formattedPat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(series[seriesEachIndex][hoverIndex]).toString().replace('€', '')
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">${formattedPat} - ${assetName}</span><br />`;
                        }
                    });

                    const formatHoverX = new Date(hoverXaxis).toLocaleDateString();

                    return `<div class=tooltip">
                                <div class="tooltip-header">${formatHoverX}</div>
                                <div class="tooltip-body">
                                    ${hoverList}
                                </div>
                            </div>`;
                },
            }
        })
    }
}

function carregarDadosDrawdown(datasource) {
    graficoDrawdown = []
    var colorsGraph = []
    if (datasource) {

        Array.from(datasource)?.map(function (item) {
            var data = []
            if (item.drawdown != null) {
                item.drawdown?.map(function (draw) {
                    var y = draw.value.toFixed(2);
                    var x = new Date(draw.date).getTime();
                    data.push({ x: x, y: y })
                });

                let newSerie = {
                    name: item.fund.title,
                    type: "line",
                    data: data
                }

                colorsGraph.push(item.color)

                if (item.fund.id >= 0) {
                    graficoDrawdown.push(newSerie)
                }
            }
        })

        drawdownChart.updateSeries(graficoDrawdown)
        if (colorsGraph.length > 0) { drawdownChart.updateOptions({ colors: colorsGraph.map(color => getHexColor(color)) }) }
        drawdownChart.updateOptions({
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                itemMargin: {
                    horizontal: 5,
                    vertical: 0
                },
            },
            tooltip: {
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const hoverXaxis = w?.globals.seriesX[seriesIndex][dataPointIndex];
                    const hoverIndexes = w?.globals.seriesX.map(seriesX => {
                        return seriesX.findIndex(xData => xData === hoverXaxis);
                    });

                    let hoverList = '';
                    hoverIndexes.forEach((hoverIndex, seriesEachIndex) => {
                        let assetName = ''
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            if (w?.globals.seriesNames[seriesEachIndex].length > 15) {
                                assetName = w?.globals.seriesNames[seriesEachIndex].toString().substring(0, 15) + '...'
                            } else {
                                assetName = w?.globals.seriesNames[seriesEachIndex]
                            }
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">${(series[seriesEachIndex][hoverIndex]).toString().replace('.', ',')}% - ${assetName}</span><br />`;
                        }
                    });
                    const formatHoverX = new Date(hoverXaxis).toLocaleDateString();

                    return `<div class=tooltip">
                                <div class="tooltip-header">${formatHoverX}</div>
                                <div class="tooltip-body">
                                    ${hoverList}
                                </div>
                            </div>`;
                },
            }
        })
    }
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

function carregarDadosPatrimonio(datasource) {
    graficoPatrimonio = []
    var colorsGraph = []

    if (datasource) {

        Array.from(datasource)?.map(function (item) {

            if (item.patrimony !== null) {

                var data = []
                item.patrimony.map(function (pat) {
                    var y = pat.value.toFixed(2);
                    var x = new Date(pat.date).getTime();
                    data.push({ x: x, y: y })
                });

                let newSerie = {
                    name: item.fund.title,
                    type: "line",
                    data: data
                }

                colorsGraph.push(item.color)

                if (item.fund.id >= 0) {
                    graficoPatrimonio.push(newSerie)
                }
            }
        })

        // * Render ApexChart Graphic
        patrimonioChart.updateSeries(graficoPatrimonio)
        if (colorsGraph.length > 0) { patrimonioChart.updateOptions({ colors: colorsGraph.map(color => getHexColor(color)) }) }
        patrimonioChart.updateOptions({
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                itemMargin: {
                    horizontal: 5,
                    vertical: 0
                },
            },
            tooltip: {
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const hoverXaxis = w?.globals.seriesX[seriesIndex][dataPointIndex];
                    const hoverIndexes = w?.globals.seriesX.map(seriesX => {
                        return seriesX.findIndex(xData => xData === hoverXaxis);
                    });

                    let hoverList = '';
                    hoverIndexes.forEach((hoverIndex, seriesEachIndex) => {
                        let assetName = ''
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            if (w?.globals.seriesNames[seriesEachIndex].length > 15) {
                                assetName = w?.globals.seriesNames[seriesEachIndex].toString().substring(0, 15) + '...'
                            } else {
                                assetName = w?.globals.seriesNames[seriesEachIndex]
                            }
                            var formattedPat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(series[seriesEachIndex][hoverIndex]).toString().replace('€', '')
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">R$ ${formattedPat} - ${assetName}</span><br />`;
                        }
                    });
                    const formatHoverX = new Date(hoverXaxis).toLocaleDateString();

                    return `<div class=tooltip">
                                <div class="tooltip-header">${formatHoverX}</div>
                                <div class="tooltip-body">
                                    ${hoverList}
                                </div>
                            </div>`;
                },
            }
        })
    }
}

function carregarDadosVolatilidade(datasource) {
    graficoVolatilidade = []
    var colorsGraph = []
    if (datasource) {

        Array.from(datasource)?.map(function (item) {
            var data = []
            if (item.volatility != null) {
                item.volatility?.map(function (vol) {
                    var y = vol.value.toFixed(2);
                    var x = new Date(vol.date).getTime();
                    data.push({ x: x, y: y })
                });

                let newSerie = {
                    name: item.fund.title,
                    type: "line",
                    data: data
                }

                colorsGraph.push(item.color)

                if (item.fund.id >= 0) {
                    graficoVolatilidade.push(newSerie)
                }
            }
        })

        volatilidadeChart.updateSeries(graficoVolatilidade)
        if (colorsGraph.length > 0) { volatilidadeChart.updateOptions({ colors: colorsGraph.map(color => getHexColor(color)) }) }
        volatilidadeChart.updateOptions({
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                itemMargin: {
                    horizontal: 5,
                    vertical: 0
                },
            },
            tooltip: {
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const hoverXaxis = w?.globals.seriesX[seriesIndex][dataPointIndex];
                    const hoverIndexes = w?.globals.seriesX.map(seriesX => {
                        return seriesX.findIndex(xData => xData === hoverXaxis);
                    });

                    let hoverList = '';
                    hoverIndexes.forEach((hoverIndex, seriesEachIndex) => {
                        let assetName = ''
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            if (w?.globals.seriesNames[seriesEachIndex].length > 15) {
                                assetName = w?.globals.seriesNames[seriesEachIndex].toString().substring(0, 15) + '...'
                            } else {
                                assetName = w?.globals.seriesNames[seriesEachIndex]
                            }
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">${(series[seriesEachIndex][hoverIndex]).toString().replace('.', ',')}% - ${assetName}</span><br />`;
                        }
                    });
                    const formatHoverX = new Date(hoverXaxis).toLocaleDateString();

                    return `<div class=tooltip">
                                <div class="tooltip-header">${formatHoverX}</div>
                                <div class="tooltip-body">
                                    ${hoverList}
                                </div>
                            </div>`;
                },
            }
        })
    }
}


function deleteFound(id) {
    localStorage.setItem('excludeCnpj', id);
    OpenModalById('#modalRemoverAtivos');
}

function deleteConfirmation() {
    var id = localStorage.getItem('excludeCnpj')
    var globalAssetList = JSON.parse(localStorage.getItem('globalAssetList'));

    var alreadyExists = globalAssetList.find(function (item) {
        return item.cnpj.includes(id);
    })
    if (alreadyExists) {
        globalAssetList.splice(globalAssetList.indexOf(alreadyExists), 1)
    }

    localStorage.setItem('excludeCnpj', undefined);
    localStorage.setItem('globalAssetList', JSON.stringify(globalAssetList));
    localStorage.removeItem('fundsResponse')

    var cnpjList = []
    globalAssetList.forEach(function (asset) {
        cnpjList.push(asset.cnpj);
    })

    loadAssetCards();

    if (cnpjList.length) {
        CallSaveFunds(cnpjList);
    } else {
        location.reload()
    }
}

function numPages() {
    return Math.ceil(
        localStorage.getItem('objJson').length / 15);
}

function prevPage() {
    let page = localStorage.getItem('currentPage');
    if (page > 1) {
        page--;
        AdicionarAtivos(page, 15, $('#item_search').val());
    }
}

function nextPage() {
    let page = localStorage.getItem('currentPage');
    if (page < numPages()) {
        page++;
        AdicionarAtivos(page, 15, $('#item_search').val());
    }
}

function AdicionarAtivos(page, perPage, search) {
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
            OpenModalById('#modalAdicionarAtivos');

            fillModalAdicionarFundos(response.data)

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

function searchActives() {
    var timer = 0;

    $("#item_search").keyup(function (event) {
        var ipValue = event.target.value;

        if (String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) {

            if (ipValue.length >= 2) {

                clearTimeout(timer);

                ipValue = event.target.value

                timer = setTimeout(() => AdicionarAtivos(1, 15, ipValue.toUpperCase()), 700);

                localStorage.setItem('assetModalSearch', true)
                $("#item_search").val(ipValue)

                var title = $("#search-box-title")
                title.html('Ativo(s) adicionado(s)')
            }
        }
        if (event.shiftKey) {
            event.preventDefault();
            return;
        }
        else {
            if (event.keyCode < 95) {
                if (event.keyCode < 48 || event.keyCode > 57) {
                    event.preventDefault();
                    return;
                }
                
            }
            else {
                if (event.keyCode < 96 || event.keyCode > 105) {
                    event.preventDefault();
                    return;
                }
            }
            if (!ipValue) {
                localStorage.setItem('assetModalSearch', null)
                $("#btn_prev").remove()
                $("#btn_next").remove()
                fillModalType();
            }
        }
    });
}

function fillModalType() {
    localStorage.setItem("assetList", localStorage.getItem("globalAssetList"))
    OpenModalById('#modalAdicionarAtivos')

    var modalRow = $('#actives-row')
    modalRow.html('')

    var newRow = ''
    
    var searched = localStorage.getItem('assetModalSearch')
    
    var title
    if (searched && searched !== 'null') {
        title = 'Ativo(s) adicionado(s)'
    } else {
        title = 'Fundos mais Pesquisados'
        fillPopularFunds()   
    }
    
    newRow = `<h1 id="search-box-title" class="actives">${title}</h1>
                    <div id="search-box">
                        <img src="../Images/search.svg" />
                        <script>
                            searchActives()
                        </script>
                        <input id="item_search" placeholder="Buscar" /> 
                    </div>`
    
    modalRow.append(newRow)    

}

function fillModalAdicionarFundos(datasource) {
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

            var newCard = `<div class="card" id="card_${positiveID}" style="flex-direction: row">
                                <div class="row">
                                    <div class="retangle ${item.color}"></div>
                                    <div class="column">
                                        <div class="card-header" style="height: 50%">
                                            <div href="#" rel="tooltip" data-placement="top" title="${item.name.trim()}">
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

function detalharFundo(id, color) {
    localStorage.setItem('fundDetailColor', color)
    document.location = `/FundDetail?id=${id}`
}

function salvaFundosPesquisados(newData) {
    if (!newData) return;

    var data = newData.filter(function(d){ return d.fund.id >= 0})    
    data = data.slice(-3)

    var lastViewedFunds = JSON.parse(localStorage.getItem("lastViewedFunds"))
    if(!lastViewedFunds) {
        lastViewedFunds = data
    } else {
        data.map(function(d){
            if(!lastViewedFunds.find(e => e.fund.cnpj == d.fund.cnpj)) {
                lastViewedFunds.push(d)
            }
        })
    }
    lastViewedFunds = lastViewedFunds.slice(-3)
    localStorage.setItem("lastViewedFunds", JSON.stringify(lastViewedFunds))
}

function showModalNotMatch() {
    $(modalNotMatch).modal({ backdrop: 'static', keyboard: false })
}

function saveNewFunds(cnpjFunds, filterType, initialDate, finalDate) {
    var userId = localStorage.getItem("userId");
    if(!userId || userId === 'null' || userId === 'undefined') {
        userId = "";
    }
    
    let parameters = { CnpjFunds: cnpjFunds, FilterType: filterType ? filterType : 0, InitialDate: initialDate ? initialDate : "", FinalDate: finalDate ? finalDate : "", AddFunds: true, UserId: userId }
    let url = "/FundsComparation/Save"
    $.post(url, parameters, function (response) {
        if ((initialDate || finalDate) && response.responseText == 'no content') {
            return showModalNotMatch()
        }
        if (response.status) {
            var dados = response.data
            var newData  = dados.map(data => {
                return JSON.parse(localStorage.getItem('itemColors')).find(item => data.fund.cnpj == item.id)?.color ? { ...data, color: color = JSON.parse(localStorage.getItem('itemColors')).find(item => data.fund.cnpj == item.id)?.color } : data
            })

            localStorage.setItem('fundsResponse', JSON.stringify(newData))
            if(response.data) {
                salvaFundosPesquisados(newData)
                carregaTableHistorico(newData)
                carregaTableIndice(newData)
                carregaTableConsistencia(newData)
                carregaTableVolatilidade(newData)
                carregaTableCorrelacao(newData)
                carregarGraficos(newData)
                defineTitulos(newData)
                carregarCores(newData)    
            }
            LoadingOFF()
        }
    });
}

function defineTitulos(data) {
    var titulo = ""
    var titulos = $('#titulos')
    titulos.html('')

    data.map(function (item) {
        if (item.fund.id >= 0) {
            titulo += `${item.fund.title} `
        }
    })
    titulos.append(titulo)
}

function carregaTableHistorico(data) {
    var corpo
    var historicalRentability
    var historicalGraph = $('#historicoTable')
    historicalGraph.html('')

    data.map(function (item) {
        if (item.historicalRentability) {
            corpo += `
                    <tr class="table-row" id="rh_${item.historicalRentability?.fundID}" style=" padding-top: 5px; padding-bottom: 5px">
                    <td style="padding-left: 40px">
                        <div class="row" style="align-items: center">
                            <div class="retangle ${item.color}" style="margin-right: 8px; margin-left: 0px"></div>
                            <div href="#" rel="tooltip" data-placement="top" title="${item.fund.title}">
                                <div class="card-title">${item.fund.title.length > 15 ? item.fund.title.substring(0, 15) : item.fund.title}</div>
                            </div>
                        </div>
                    </td>
                    <td class="flex-item ${item.historicalRentability.currentMonth < 0 ? "red-percent" : "normal-percent"}">${item.historicalRentability.currentMonth.toFixed(2).replace('.', ',')}%</td>
                    <td class="flex-item ${item.historicalRentability.currentYear < 0 ? "red-percent" : "normal-percent"}">${item.historicalRentability.currentYear.toFixed(2).replace('.', ',')}%</td>
                    <td class="flex-item ${item.historicalRentability.last3Months < 0 ? "red-percent" : "normal-percent"}">${item.historicalRentability.last3Months.toFixed(2).replace('.', ',')}%</td>
                    <td class="flex-item ${item.historicalRentability.last6Months < 0 ? "red-percent" : "normal-percent"}">${item.historicalRentability.last6Months.toFixed(2).replace('.', ',')}%</td>
                    <td class="flex-item ${item.historicalRentability.last12Months < 0 ? "red-percent" : "normal-percent"}">${item.historicalRentability.last12Months.toFixed(2).replace('.', ',')}%</td>
                    <td class="flex-item ${item.historicalRentability.last24Months < 0 ? "red-percent" : "normal-percent"}">${item.historicalRentability.last24Months.toFixed(2).replace('.', ',')}%</td>
                    <td class="flex-item ${item.historicalRentability.last36Months < 0 ? "red-percent" : "normal-percent"}">${item.historicalRentability.last36Months.toFixed(2).replace('.', ',')}%</td>
                </tr>
                `
        }
    })

    historicalRentability = `
                        <thead>
                            <tr class="table-row">
                                <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Fundo</div></th>
                                <th><div class="actives-table">No Mês</div></th>
                                <th><div class="actives-table">No Ano</div></th>
                                <th><div class="actives-table">3 Meses</div></th>
                                <th><div class="actives-table">6 Meses</div></th>
                                <th><div class="actives-table">12 Meses</div></th>
                                <th><div class="actives-table">24 Meses</div></th>
                                <th><div class="actives-table">36 Meses</div></th>
                            </tr>
                        </thead>
                            ${corpo}`

    historicalGraph.append(historicalRentability)

    if (!cdiChecked) {
        $("#rh_-1").toggle()
    }

    if (!ibovespaChecked) {
        $("#rh_-2").toggle()
    }

    if (!dolarChecked) {
        $("#rh_-3").toggle()
    }

    if (!ipcaChecked) {
        $("#rh_-4").toggle()
    }
    if (!igpmChecked) {
        $("#rh_-5").toggle()
    }

    if (!selicChecked) {
        $("#rh_-6").toggle()
    }
}

function carregaTableConsistencia(data) {
    var consistencia
    var corpo
    var consistenciaGraph = $('#consistenciaTable')
    consistenciaGraph.html('')

    data.map(function (item) {
        if(item.consistency?.fundID >= 0) {
            corpo += `
                    <tr class="table-row" id="cons_${item.consistency?.fundID}" style="padding-top: 5px; padding-bottom: 5px">
                    <td style="padding-left: 40px">
                        <div class="row" style="align-items: center">
                            <div class="retangle ${item.color}" style="margin-right: 8px; margin-left: 0px"></div>
                            <div href="#" rel="tooltip" data-placement="top" title="${item.fund.title}">
                                <div class="card-title">${item.fund.title.length > 15 ? item.fund.title.substring(0, 15) : item.fund.title}</div>
                            </div>
                        </div>
                    </td>
                    <td class="flex-item ${item.consistency?.positiveMonths < 0 ? "red-percent" : "normal-percent"}">${item.consistency?.positiveMonths || 0}</td>
                    <td class="flex-item ${item.consistency?.negativeMonths < 0 ? "red-percent" : "normal-percent"}">${item.consistency?.negativeMonths || 0}</td>
                    <td class="flex-item ${item.consistency?.majorReturn < 0 ? "red-percent" : "normal-percent"}">${item.consistency?.majorReturn.toFixed(2).replace('.', ',') || 0}%</td>
                    <td class="flex-item ${item.consistency?.minorReturn < 0 ? "red-percent" : "normal-percent"}">${item.consistency?.minorReturn.toFixed(2).replace('.', ',') || 0}%</td>
                    <td class="flex-item ${item.consistency?.cdiUp < 0 ? "red-percent" : "normal-percent"}">${item.consistency?.cdiUp || 0}</td>
                    <td class="flex-item ${item.consistency?.cdiDown < 0 ? "red-percent" : "normal-percent"}">${item.consistency?.cdiDown || 0}</td>
                    <td class="flex-item ${item.consistency?.actualPL < 0 ? "red-percent" : "normal-percent"}">${maskYaxis(item.consistency?.actualPL)}</td>
                    <td class="flex-item ${item.consistency?.shareholdersCount < 0 ? "red-percent" : "normal-percent"}">${maskYaxis(item.consistency?.shareholdersCount || 0)}</td>`
        }
    })

    consistencia = `
            <thead>
                <tr class="table-row">
                    <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Fundo</div></th>
                    <th><div class="actives-table">Meses Positivo</div></th>
                    <th><div class="actives-table">Meses Negativos</div></th>
                    <th><div class="actives-table">Maior Retorno</div></th>
                    <th><div class="actives-table">Menor Retorno</div></th>
                    <th><div class="actives-table">Acima CDI</div></th>
                    <th><div class="actives-table">Abaixo CDI</div></th>
                    <th><div class="actives-table">PL Atual</div></th>
                    <th><div class="actives-table">Nº de Cotistas</div></th>
                </tr>
            </thead>
             ${corpo}`

    consistenciaGraph.append(consistencia)
}

function carregaTableIndice(data) {
    var corpo
    var indice
    var indiceGraph = $('#indiceTable')
    indiceGraph.html('')

    data.map(function (item) {
        if (item.fund.id < 0) return;
        corpo += `<tr class="table-row" id="is_${item.sharpeIndex.fundID}" style="padding-top: 5px; padding-bottom: 5px">
                    <td style="padding-left: 40px">
                    <div class="row" style="align-items: center">
                        <div class="retangle ${item.color}" style="margin-right: 8px; margin-left: 0px"></div>
                        <div href="#" rel="tooltip" data-placement="top" title="${item.fund.title}">
                            <div class="card-title">${item.fund.title.length > 15 ? item.fund.title.substring(0, 15) : item.fund.title}</div>
                        </div>
                    </div>
                </td>
                <td class="flex-item ${item.sharpeIndex.last12Months < 0 ? "red-percent" : "normal-percent"}">${item.sharpeIndex.last12Months.toFixed(2).replace('.', ',') || 0}</td>
                <td class="flex-item ${item.sharpeIndex.starting < 0 ? "red-percent" : "normal-percent"}">${item.sharpeIndex.starting.toFixed(2).replace('.', ',') || 0}</td>
                </tr>`
    })

    indice = `
                <thead class="${data.length == 0 && 'flex'}">
                    <tr class="table-row">
                        <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Fundo</div></th>
                        <th><div class="actives-table">12 Meses</div></th>
                        <th><div class="actives-table">Início</div></th>
                    </tr>
                </thead>
                ${corpo}`

    indiceGraph.append(indice)

    if (!cdiChecked) {
        $("#is_-1").toggle()
    }

    if (!ibovespaChecked) {
        $("#is_-2").toggle()
    }

    if (!dolarChecked) {
        $("#is_-3").toggle()
    }

    if (!ipcaChecked) {
        $("#is_-4").toggle()
    }

    if (!igpmChecked) {
        $("#is_-5").toggle()
    }

    if (!selicChecked) {
        $("#is_-6").toggle()
    }
}

function carregaTableVolatilidade(data) {
    var corpo
    var volatilidade
    var volatilidadeGraph = $('#volatilidadeTable')
    volatilidadeGraph.html('')

    data.map(function (item) {
        if (item.fund.id < 0) return
        corpo += `
                        <tr class="table-row" id="vol_${item.volatilityList.fundID}" style="padding-top: 5px; padding-bottom: 5px">
                        <td style="padding-left: 40px">
                            <div class="row" style="align-items: center">
                                <div class="retangle ${item.color}" style="margin-right: 8px; margin-left: 0px"></div>
                                <div href="#" rel="tooltip" data-placement="top" title="${item.fund.title}">
                                    <div class="card-title">${item.fund.title.length > 15 ? item.fund.title.substring(0, 15) : item.fund.title}</div>
                                </div>
                            </div>
                        </td>
                        <td class="flex-item ${item.volatilityList.last12Months < 0 ? "red-percent" : "normal-percent"}">${item.volatilityList.last12Months.toFixed(2).replace('.', ',') || 0}%</td>
                        <td class="flex-item ${item.volatilityList.starting < 0 ? "red-percent" : "normal-percent"}">${item.volatilityList.starting.toFixed(2).replace('.', ',') || 0}%</td>`
    })

    volatilidade = `
                    <thead class="${data.length == 0 && 'flex'}">
                        <tr class="table-row">
                            <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Fundo</div></th>
                            <th><div class="actives-table">12 Meses</div></th>
                            <th><div class="actives-table">Início</div></th>
                        </tr>
                    </thead>
                    ${corpo}
                    `

    volatilidadeGraph.append(volatilidade)
    /* Verificar se foi clicado */
}

function carregaTableCorrelacao(data) {
    var correlacao
    var corpo
    var correlacaoItem
    var correlacaoGraph = $('#correlacaoTable')
    correlacaoGraph.html('')

    var matrix = []

    var fundTitleList = []
    var indexTitleList = []
    data.map(function (item) {
        if (item.fund.id >= 0) {
            fundTitleList.push(item.fund.title.toUpperCase());
        } else {
            indexTitleList.push(item.fund.title.toUpperCase());
        }
    })

    fundTitleList.sort();
    indexTitleList.sort();

    var titleList = [];
    fundTitleList.forEach(function (i) { titleList.push(i) })
    indexTitleList.forEach(function (i) { titleList.push(i) })

    var matrix = [];

    titleList.map(function (title) {
        var titleItem = data.find(function (item) {
            return item.fund.title.toUpperCase().includes(title);
        });

        var innerList = [];

        titleList.map(function (innerTitle) {
            // is an array
            var innerItemTitle = undefined;
            if (titleItem.correlation) {
                innerItemTitle = titleItem.correlation.find(function (innerItem) {
                    return innerItem.indexName.toUpperCase().includes(innerTitle);
                });
            }
            if (innerItemTitle) {
                innerList.push(innerItemTitle)
            } else {
                innerList.push({
                    indexName: innerTitle,
                    value: 0
                })
            }
        })

        matrix.push(innerList)

    })

    for (var i = 0; i < titleList.length; i++) {
        var lineItem = data.find(function (item) {
            return item.fund.title.toUpperCase().includes(titleList[i]);
        });
        var correlationList = matrix[i];
        var correlationHtml = ''

        var count = 0
        for (var j = 0; j < correlationList.length; j++) {
            var columnValue = correlationList[j]

            if ('CDI'.includes(columnValue.indexName.toUpperCase())) {
                cdiChecked = JSON.parse(localStorage.getItem(`cdiChecked`))                
                if (cdiChecked != null ? cdiChecked : false) {
                    count++
                    correlationHtml += `<td class="flex-item"><div id="incolval_${columnValue.indexName}" class="${columnValue.value < 1 ? "correlation-less-one" : "correlation-more-one"}" style="width: 48px; height: 48px; display: flex; align-items: center; text-align: center; justify-content: center">${columnValue.value}</div></td >`
                }
            } else if ('DOLAR'.includes(columnValue.indexName.toUpperCase())) {
                dolarChecked = JSON.parse(localStorage.getItem(`dolarChecked`))
                if (dolarChecked != null ? dolarChecked : false) {
                    count++
                    correlationHtml += `<td class="flex-item"><div id="incolval_${columnValue.indexName}" class="${columnValue.value < 1 ? "correlation-less-one" : "correlation-more-one"}" style="width: 48px; height: 48px; display: flex; align-items: center; text-align: center; justify-content: center">${columnValue.value}</div></td >`
                }
            } else if ('IBOVESPA'.includes(columnValue.indexName.toUpperCase())) {
                ibovespaChecked = JSON.parse(localStorage.getItem(`ibovespaChecked`))
                if (ibovespaChecked != null ? ibovespaChecked : false) {
                    count++
                    correlationHtml += `<td class="flex-item"><div id="incolval_${columnValue.indexName}" class="${columnValue.value < 1 ? "correlation-less-one" : "correlation-more-one"}" style="width: 48px; height: 48px; display: flex; align-items: center; text-align: center; justify-content: center">${columnValue.value}</div></td >`
                }
            } else if ('IPCA'.includes(columnValue.indexName.toUpperCase())) {
                ipcaChecked = JSON.parse(localStorage.getItem(`ipcaChecked`))
                if (ipcaChecked != null ? ipcaChecked : false) {
                    count++
                    correlationHtml += `<td class="flex-item"><div id="incolval_${columnValue.indexName}" class="${columnValue.value < 1 ? "correlation-less-one" : "correlation-more-one"}" style="width: 48px; height: 48px; display: flex; align-items: center; text-align: center; justify-content: center">${columnValue.value}</div></td >`
                }
            } else if ('IGPM'.includes(columnValue.indexName.toUpperCase())) {
                igpmChecked= JSON.parse(localStorage.getItem(`igpmChecked`))
                if (igpmChecked != null ? igpmChecked : false) {
                    count++
                    correlationHtml += `<td class="flex-item"><div id="incolval_${columnValue.indexName}" class="${columnValue.value < 1 ? "correlation-less-one" : "correlation-more-one"}" style="width: 48px; height: 48px; display: flex; align-items: center; text-align: center; justify-content: center">${columnValue.value}</div></td >`
                }
            } else if ('SELIC'.includes(columnValue.indexName.toUpperCase())) {
                selicChecked= JSON.parse(localStorage.getItem(`selicChecked`))
                if (selicChecked != null ? selicChecked : false) {
                    count++
                    correlationHtml += `<td class="flex-item"><div id="incolval_${columnValue.indexName}" class="${columnValue.value < 1 ? "correlation-less-one" : "correlation-more-one"}" style="width: 48px; height: 48px; display: flex; align-items: center; text-align: center; justify-content: center">${columnValue.value}</div></td >`
                }
            } else {
                count++
                correlationHtml += `<td class="flex-item"><div id="incolval_${columnValue.indexName}" class="${columnValue.value < 1 ? "correlation-less-one" : "correlation-more-one"}" style="width: 48px; height: 48px; display: flex; align-items: center; text-align: center; justify-content: center">${columnValue.value}</div></td >`
            }

        }

        if (count > 5) {
            $('#correlation-risk').addClass('flex-row-wrap');
            $('#correlation-risk-flex').addClass('flex-row-fill');
        } else {
            $('#correlation-risk').removeClass('flex-row-wrap');
            $('#correlation-risk-flex').removeClass('flex-row-fill');
        }

        corpo += `  <th id="corcol_${lineItem.volatilityList.fundID}">
                        <div class="actives-table">
                            <div class="retangle ${lineItem.color}" style="width:100%; margin-right: 8px; margin-left: 0px; width: 48px; height: 6px"></div>
                        </div>
                    </th>`

        correlacaoItem += `
                        <tr class="table-row" id="corval_${lineItem.fund.id}" style="padding-top: 5px; padding-bottom: 5px">
                            <td style="padding-left: 40px">
                                <div class="row" style="align-items: center">
                                    <div class="retangle ${lineItem.color}" style="margin-right: 8px; margin-left: 0px"></div>
                                    <div href="#" rel="tooltip" data-placement="top" title="${lineItem.fund.title}">
                                        <div class="card-title">${lineItem.fund.title.length > 15 ? lineItem.fund.title.substring(0, 15) : lineItem.fund.title}</div>
                                    </div>
                                </div>
                            </td>
                                ${correlationHtml}
                        </tr>`


    }
    correlacao = `
                <thead class="${titleList.length == 0 && 'flex'}">
                    <tr class="table-row">
                        <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Fundo</div></th>
                        ${corpo}
                    </tr>
                </thead>
                ${correlacaoItem}
                `

    correlacaoGraph.append(correlacao)

    if (!cdiChecked) {
        $("#corcol_-1").toggle()
        $("#corval_-1").toggle()
    }

    if (!ibovespaChecked) {
        $("#corcol_-2").toggle()
        $("#corval_-2").toggle()
    }

    if (!dolarChecked) {
        $("#corcol_-3").toggle()
        $("#corval_-3").toggle()
    }

    if (!ipcaChecked) {
        $("#corcol_-4").toggle()
        $("#corval_-4").toggle()
    }
    if (!igpmChecked) {
        $("#corcol_-5").toggle()
        $("#corval_-5").toggle()
    }

    if (!selicChecked) {
        $("#corcol_-6").toggle()
        $("#corval_-6").toggle()
    }
}

function carregarGraficos(datasource) {

    // * Gráfico de Rentabilidade
    carregarDadosGraficoRentabilidade(datasource)

    // * Gráfico de Risco x Retorno
    carregarDadosRetornoRisco(datasource)

    // * Gráfico de Cotistas
    carregarDadosCotistas(datasource)

    // * Gráfico de Drawdown
    carregarDadosDrawdown(datasource)

    // * Gráfico de Patrimônio
    carregarDadosPatrimonio(datasource)

    // * Gráfico de Volatilidade
    carregarDadosVolatilidade(datasource)
}

function neg2pos(val) { return Math.abs(val) }

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

function itemClickLastViewed(id) {
    var chk = getAssetListCount()
    if (chk >= 5) {
        var assetList = JSON.parse(localStorage.getItem('assetList'));
        if (assetList && assetList != 'null') {
            var alreadyExists = assetList.find(function (item) {
                return item.cnpj.includes(id);
            })
            if (!alreadyExists) {
                $(`#rk_${id}`).prop("checked", false)
                return;
            }
        }
    }


    let isEnabled = !($(`#rk_${id}`).is(":disabled"))
    // * Verifica se já marcou(check) o limite de ativos = 5
    if (isEnabled) {
        let ischecked = Boolean($(`#rk_${id}`).is(":checked"))
        $(`#rk_${id}`).prop("checked", !ischecked)
        updateAssetList(id, !ischecked)
    } else {
        $(`#rk_${id}`).prop("checked", false)
    }
}

function countVerifyChecked() {
    var chk = getAssetListCount()

    var notchk = $("input:checkbox:not(:checked)")

    if (chk > 5) {
        for (var i = 0; i < notchk.length; i++) {

            let name = notchk[i].id.replace('ck_', '').replace('rk_', '')
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

    CallSaveFunds(cnpjList)

    loadAssetCards()

    preencherSimilarFunds()

    $('#item_search').val('');
}

function preencherSimilarFunds() {
    var url = "/SimilarFunds/GetSimilarFunds"
    var globalAssetList = JSON.parse(localStorage.getItem('globalAssetList'));
    if (!globalAssetList) {return}
    
    var cnpjs = []
    Array.from(globalAssetList)?.map(function (asset) {
        cnpjs.push(asset.cnpj);
    })
    
    let parameters = { cnpjs: cnpjs }
    $('#similar-funds').html('Carregando...')
    
    $.ajax({
        url: url, 
        type: 'POST',
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            if (response.status) {
                var similarFunds = $('#similar-funds')
                similarFunds.html('')
                Array.from(response.data).map(function (fs) {
                    var parsedTitle = fs.denomSocial.length > 15 ? fs.denomSocial.substring(0, 15) : fs.denomSocial
                    var parsedClass = fs.classeAnbima.length > 25 ? fs.classeAnbima.substring(0, 25) + '...' : fs.classeAnbima
                    var formattedCnpj = fs.cnpjFundo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
                    let positiveID = neg2pos(fs.cnpjFundo)
                    var newCard = `<div class="card similar-founds">
                            <div class="row">
                                <div class="retangle-similar ${fs.color}">
                                </div>
                                <script type="text/javascript">
                                    $(function () {
                                        $("[rel='tooltip']").tooltip();
                                    });
                                </script>
                                <div class="column similar-column" style="min-width: 245px">
                                    <div class="card-header" style="cursor: pointer">
                                        <div href="#" rel="tooltip" data-placement="top" title="${fs.denomSocial}" onclick="detalharFundo(\`${fs.cnpjFundo}\`, \`${fs.color}\`)">
                                            <div class="row" style="width: 100%; align-items: center; justify-content: space-between" data-toggle="tooltip">
                                                ${parsedTitle}
                                            </div>
                                        </div>
                                        <div href="#" rel="tooltip" data-placement="top" title="${positiveID}">
                                            <div class="row" style="width: 100%; align-items: center; justify-content: space-between; color: #637692" data-toggle="tooltip">
                                                ${formattedCnpj}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="modality">
                                            <div href="#" rel="tooltip" data-placement="top" title="${fs.classeAnbima}">
                                                <div class="row" style="width: 100%; align-items: center; justify-content: space-between" data-toggle="tooltip">
                                                    ${parsedClass}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row-inside">
                                            <div class="divider">
                                                <a class="rentability ${fs.profitability < 0 ? "red-percent" : "normal-percent"}">${fs.profitability}%</a>
                                                <p>Rent. 12 Meses</p>
                                            </div>

                                            <div class="divider">
                                                <a style="font-weight: 600">R$ ${maskYaxis(fs.patrimony)}</a>
                                                <p>Patrimônio Líquido</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    similarFunds.append(newCard);
                })
            }
        }
    })
    
}

function CallSaveFunds(cnpjList) {
    saveNewFunds(cnpjList);
}

//receive cnpj(id) and checked status to add or remove from temporary list.
function updateAssetList(id, checked) {
    $(`#ck_${id}`).prop("checked", checked)
    $(`#rk_${id}`).prop("checked", checked)
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

function clearAssetList() {
    localStorage.setItem('assetList', null);
    localStorage.setItem('assetModalSearch', null);
    $('#item_search').val('');
    $("#btn_prev").remove()
    $("#btn_next").remove()
    fillModalType();
}

function getAssetListCount() {
    var assetList = JSON.parse(localStorage.getItem('assetList'));
    if (!assetList || assetList == 'null') return 0;
    return assetList.length;
}

function fillPopularFunds() {
    var assetList = localStorage.getItem("assetList")
    if (!assetList || assetList == 'null') {
        localStorage.setItem("assetList", localStorage.getItem("globalAssetList"))
    }
    
    $.get('/popular-funds', function (response) {
        if (response.data) {            
            var popularFundsResponse = response.data

            var cardlist = $('#actives-list')
            cardlist.html('')            
            if(popularFundsResponse != null) {        
                if(!popularFundsResponse.length) {
                    var paraphase = `<div class="row">
                                Não existem ativos para serem listados
                            </div>`;
                    return cardlist.append(paraphase)
                }
                var userId = localStorage.getItem("userId")
                if((userId && userId !== 'null' && userId !== 'undefined') || (localStorage.getItem("lastViewedFunds"))) {
                    if(popularFundsResponse.length>3) {
                        popularFundsResponse = popularFundsResponse.slice(0, 3);
                    }
                }
                localStorage.setItem('objJson', JSON.stringify(popularFundsResponse))
                var assetList = localStorage.getItem('assetList');

                popularFundsResponse.forEach(function (item) {
                    var includes = assetList.includes(item.cnpj);
                    var checkBoxActive = includes ? 'checked' : '';

                    let strTitle = item.name.trim()
                    strTitle = strTitle.length > 15 ? strTitle.substr(0, 15) : strTitle

                    let formattedClass = item.class.split('-')[0]

                    let formattedCnpj = item.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")

                    let positiveID = neg2pos(item.cnpj)

                    var newCard = `<div class="card" id="card_${positiveID}" style="flex-direction: row">
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
            }             
        }

        fillLastViewedFunds()
    })
}

function fillLastViewedFunds() {
    var userId = localStorage.getItem("userId")
    
    if(!userId || userId === 'null' || userId === 'undefined') {

        var modalBody = $('#actives-body')
        var lastViewedFunds = JSON.parse(localStorage.getItem("lastViewedFunds"))
        
        if(lastViewedFunds != null) {
            if(!lastViewedFunds.length) {
                return;
            }

            $("#last-viewed-funds-title").remove();
            $('#last-viewed-funds-list').remove();
            newRow = `<h1 id="last-viewed-funds-title" class="actives">Suas Últimas Pesquisas</h1>`
            modalBody.append(newRow)

            var cardDiv = `<div id="last-viewed-funds-list" class="cards-list" style="padding: 20px; margin: 15px"></div>`
            modalBody.append(cardDiv)

            var cardlist = $('#last-viewed-funds-list')
            cardlist.html('')

            var userId = localStorage.getItem("userId")
            if(userId && userId !== 'null' && userId !== 'undefined') {
                if(lastViewedFunds.length>3) {
                    lastViewedFunds = lastViewedFunds.slice(0, 3);
                }
            }


            var funds = JSON.parse(localStorage.getItem('objJson'))
            if(funds) {
                var parsedFunds = lastViewedFunds?.map(e => {
                    const { title, ...withoutTitle } = e.fund;
                    return ({
                        ...e, fund: { ...withoutTitle, name: e.fund.title }
                    })
                })
                parsedFunds.map(function(e) {
                    var alreadyExists = funds.find(function (item) {
                        return item.cnpj.includes(e.fund.cnpj);
                    })
                    if(!alreadyExists) {
                        funds.push(e.fund)
                    }
                })
                
            } else {
                funds = lastViewedFunds;
            }

            localStorage.setItem('objJson', JSON.stringify(funds))
            var assetList = localStorage.getItem('assetList');
            lastViewedFunds.forEach(function (item) {
                var includes = assetList.includes(item.fund.cnpj);
                var checkBoxActive = includes ? 'checked' : '';

                let strTitle = item.fund.title.trim()
                strTitle = strTitle.length > 15 ? strTitle.substr(0, 15) : strTitle

                let formattedClass = item.fund.class.split('-')[0]

                let formattedCnpj = item.fund.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")

                let positiveID = neg2pos(item.fund.cnpj)

                var newCard = `<div class="card" id="card_${positiveID}" style="flex-direction: row">
                                <div class="row">
                                    <div class="retangle ${item.color}"></div>
                                    <div class="column">
                                        <div class="card-header" style="height: 50%">
                                            <div href="#" rel="tooltip" data-placement="top" title="${item.fund.title}">
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
                                    <label class="checkbox-input" onclick="itemClickLastViewed(${positiveID})">
                                        <input id="rk_${positiveID}" class="checkbox-input" ${checkBoxActive ? "checked" : ""} type="checkbox" />
                                        <span class="checkmark"></span>
                                    </label>
                                </div>
                            </div>`
                cardlist.append(newCard)
            })
        }
        return
    }
    
    $.get(`/popular-funds/recent-from-user/${userId}`, async = false, function (response) {
        if (response.data) {
            $("#last-viewed-funds-title").remove();
            $('#last-viewed-funds-list').remove();

            
            
            // localStorage.setItem("lastViewedFunds",JSON.stringify(response.data))
            
            var modalBody = $('#actives-body')            
            var lastViewedFunds = response.data; 
            if(lastViewedFunds != null) {                
                if(!lastViewedFunds.length) {
                    return;
                }
                newRow = `<h1 id="last-viewed-funds-title" class="actives">Suas Últimas Pesquisas</h1>`                
                modalBody.append(newRow)
                
                var cardDiv = `<div id="last-viewed-funds-list" class="cards-list" style="padding: 20px; margin: 15px"></div>`
                modalBody.append(cardDiv)

                var cardlist = $('#last-viewed-funds-list')
                cardlist.html('')
                
                var userId = localStorage.getItem("userId")
                if(userId && userId !== 'null' && userId !== 'undefined') {
                    if(lastViewedFunds.length>3) {
                        lastViewedFunds = lastViewedFunds.slice(0, 3);
                    }
                }
                var funds = JSON.parse(localStorage.getItem('objJson'))
                if(funds) {
                    response.data?.map(function(e) {
                        var alreadyExists = funds.find(function (item) {
                            return item.cnpj.includes(e.cnpj);
                        })
                        if(!alreadyExists) {
                            funds.push(e)
                        }
                    })

                } else {
                    funds = response.data;
                }

                localStorage.setItem('objJson', JSON.stringify(funds))
                
                var assetList = localStorage.getItem('assetList');
                lastViewedFunds.forEach(function (item) {
                    var includes = assetList.includes(item.cnpj);
                    var checkBoxActive = includes ? 'checked' : '';

                    let strTitle = item.name.trim()
                    strTitle = strTitle.length > 15 ? strTitle.substr(0, 15) : strTitle

                    let formattedClass = item.class.split('-')[0]

                    let formattedCnpj = item.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")

                    let positiveID = neg2pos(item.cnpj)

                    var newCard = `<div class="card" id="card_${positiveID}" style="flex-direction: row">
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
                                    <label class="checkbox-input" onclick="itemClickLastViewed(${positiveID})">
                                        <input id="rk_${positiveID}" class="checkbox-input" ${checkBoxActive ? "checked" : ""} type="checkbox" />
                                        <span class="checkmark"></span>
                                    </label>
                                </div>
                            </div>`
                    cardlist.append(newCard)
                })
            }
        }
    })
}

function removeAsset(id) {
    //remove from fundsresposne
    //remove from globalassetlist
    var assetList = JSON.parse(localStorage.getItem('globalAssetList'))
    assetList = assetList.filter(function(o) { return  o.cnpj !== id})
    localStorage.setItem('globalAssetList', JSON.stringify(assetList))
    //remove from colors
    var itemColors = JSON.parse(localStorage.getItem('itemColors'))
    itemColors = itemColors.filter(function(o) {return o.id !== id})
    localStorage.setItem('itemColors', JSON.stringify(itemColors))

    var data = []
    
    if(assetList.length) {
        var data = JSON.parse(localStorage.getItem('fundsResponse'))
        data = data.filter(function(o) { return  o.fund.cnpj !== id})
        localStorage.setItem('fundsResponse', JSON.stringify(data))
    } else {
        localStorage.setItem('fundsResponse', JSON.stringify([]))
    }
    
    
    //re-render from charts
    loadAssetCards()
    carregarGraficos(data)
    carregaTableHistorico(data)
    carregaTableIndice(data)
    carregaTableConsistencia(data)
    carregaTableVolatilidade(data)
    carregaTableCorrelacao(data)
    defineTitulos(data)
    carregarCores(data)
    preencherSimilarFunds()
}