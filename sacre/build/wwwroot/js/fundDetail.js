var modalShare = '#modalShare'
var modalInvest = '#modalInvest'
var modalIndicate = '#modalIndicate'
var modalIndicateError = '#modalIndicateError'
var modalFavorite = '#modalFavorite'
var modalFavoriteError = '#modalFavoriteError'
var modalFavoriteBody = '#modalFavoriteBody'
var modalNotMatch = '#modalNotMatch'
var dados = {}

$(window).on("unload", function () {
    Unload()
})

function Unload() {
    dados = {}
}

function getHexColor(colorStr) {
    var a = document.createElement('div');
    a.style.color = colorStr;
    var colors = window.getComputedStyle(document.body.appendChild(a)).color.match(/\d+/g).map(function (a) { return parseInt(a, 10); });
    document.body.removeChild(a);
    return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
}

$(document).ready(function () {

    if (localStorage.getItem('cdiDetailChecked') == 'null' || !localStorage.getItem('cdiDetailChecked')) {
        localStorage.setItem('cdiDetailChecked', true)
    }

    var fund = localStorage.getItem("fundDetailsFunds")
    dados = localStorage.getItem("fundDetailsFunds")

    renderIndexes()
    renderFilters()

    var indexes = ['otimo', '1ano', '2anos', 'personalizado']
    var hasClick = []
    for (var i = 0; i < indexes.length; i++) {
        hasClick.push($(`#${indexes[i]}`).hasClass('clicked'))
    }

    if (!hasClick.includes(true)) {
        $(`#otimo`).toggleClass('clicked', true)
    }

    if (fund != null) {
        var datasource = JSON.parse(fund)
        var dataWithColors = datasource.map(data => {
            if (data.informacoes.id < 0) {
                return { ...data, color: getItemColor(data.informacoes.id) }
            }
            return data
        })

        fillDataSheet(dataWithColors)
        fillIndicatorsTable(dataWithColors)
        fillHistoricalRentabilityCDI(dataWithColors)
        fillHistoricalRentabilityIbovespa(dataWithColors)
        fillAssetsRentability(dataWithColors)
        // fillConsistencyTable(dataWithColors)
        carregarGraficos(dataWithColors)
    }
});

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

// * GRAFICO COTISTAS
var cotistasOptions = {
    chart: {
        type: 'line',
        zoom: {
            enabled: false,
        }
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
    yaxis: [
        {
            opposite: true,
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
                        return 'R$ ' + maskYaxis(value, value.toString().length);
                    }
                    return 'R$ ' + value.toFixed(0);
                },
            }
        },
        {
            axisTicks: {
                show: true,
            },
            labels: {
                formatter: function (value) {
                    if (value > 1000) {
                        return 'R$ ' + maskYaxis(value, value.toString().length);
                    }
                    return 'R$ ' + value.toFixed(0);
                },
            },
            title: {
                text: "Patrimônio médio por cotista",
                style: {
                    color: '#637692',
                    fontSize: '12px',
                    fontWeight: 400,
                },
            }
        },
    ],
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

function carregarDadosGraficoRentabilidade(datasource) {
    var graficoRentabil = []
    var colorsGraph = []
    if (datasource) {
        Array.from(datasource).map(function (item) {
            if (item.rentabilidade != null) {
                var data = []
                var name = item.informacoes.razaoSocial
                item.rentabilidade?.map(function (profit) {
                    var y = profit.value.toFixed(2);
                    var x = new Date(profit.date).getTime();
                    data.push({ x: x, y: y })
                });

                let newSerie = {
                    name: name,
                    type: "line",
                    data: data
                }

                if (item.informacoes.id >= 0) {
                    graficoRentabil.push(newSerie)
                    colorsGraph.push(localStorage.getItem('fundDetailColor'))
                }
                else if (item.informacoes.id == -1 && cdiDetailChecked) {
                    graficoRentabil.push(newSerie)
                    colorsGraph.push(item.color)
                }
                else if (item.informacoes.id == -2 && ibovespaDetailChecked) {
                    graficoRentabil.push(newSerie)
                    colorsGraph.push(item.color)
                }
                else if (item.informacoes.id == -3 && dolarDetailChecked) {
                    graficoRentabil.push(newSerie)
                    colorsGraph.push(item.color)
                }
                else if (item.informacoes.id == -4 && ipcaDetailChecked) {
                    graficoRentabil.push(newSerie)
                    colorsGraph.push(item.color)
                }
                else if (item.informacoes.id == -5 && igpmDetailChecked) {
                    graficoRentabil.push(newSerie)
                    colorsGraph.push(item.color)
                }
                else if (item.informacoes.id == -6 && selicDetailChecked) {
                    graficoRentabil.push(newSerie)
                    colorsGraph.push(item.color)
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

function carregarDadosCotistas(datasource) {
    graficoCotistas = []
    var colorsGraph = []

    if (datasource) {
        Array.from(datasource)?.map(function (item) {
            var data = []
            if (item.cotista !== null) {
                item.cotista.map(function (share) {
                    var y = share.value.toFixed(2);
                    var x = new Date(share.date).getTime();
                    data.push({ x: x, y: y })
                });
                let newSerie = {
                    name: item.informacoes.razaoSocial,
                    type: "line",
                    data: data
                }
                if (item.informacoes.id >= 0) {
                    graficoCotistas.push(newSerie)
                    colorsGraph.push(localStorage.getItem('fundDetailColor'))
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
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            var formattedPat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(series[seriesEachIndex][hoverIndex]).toString().replace('€', '')
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">${formattedPat} - ${w?.globals.seriesNames[seriesEachIndex]}</span><br />`;
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
                    name: item.informacoes.razaoSocial,
                    type: "line",
                    data: data
                }

                if (item.informacoes.id >= 0) {
                    graficoDrawdown.push(newSerie)
                    colorsGraph.push(localStorage.getItem('fundDetailColor'))
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

            if (item.patrimonio !== null) {

                var data = []
                item.patrimonio.map(function (pat) {
                    var y = pat.value.toFixed(2);
                    var x = new Date(pat.date).getTime();
                    data.push({ x: x, y: y })
                });

                let newSerie = {
                    name: item.informacoes.razaoSocial,
                    type: "line",
                    data: data
                }
                if (item.informacoes.id >= 0) {
                    graficoPatrimonio.push(newSerie)
                    colorsGraph.push(localStorage.getItem('fundDetailColor'))
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
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            var formattedPat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(series[seriesEachIndex][hoverIndex]).toString().replace('€', '')
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">R$ ${formattedPat} - ${w?.globals.seriesNames[seriesEachIndex]}</span><br />`;
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
            if (item.volatilidade != null) {
                item.volatilidade?.map(function (vol) {
                    var y = vol.value.toFixed(2);
                    var x = new Date(vol.date).getTime();
                    data.push({ x: x, y: y })
                });

                let newSerie = {
                    name: item.informacoes.razaoSocial,
                    type: "line",
                    data: data
                }

                if (item.informacoes.id >= 0) {
                    graficoVolatilidade.push(newSerie)
                    colorsGraph.push(localStorage.getItem('fundDetailColor'))
                }
            }
        })

        volatilidadeChart.updateSeries(graficoVolatilidade)
        if (colorsGraph.length > 0) { volatilidadeChart.updateOptions({ colors: colorsGraph.map(color => getHexColor(color)) }) }
        volatilidadeChart.updateOptions({
            /*colors: graficoColors,*/
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
                        if (hoverIndex >= 0 && (series[seriesEachIndex][hoverIndex])?.toString().replace('.', ',') != undefined) {
                            hoverList += `<span style="color: ${w?.globals.colors[w?.globals.seriesNames.findIndex(name => name === w?.globals.seriesNames[seriesEachIndex])]}">${(series[seriesEachIndex][hoverIndex]).toString().replace('.', ',')}% - ${w?.globals.seriesNames[seriesEachIndex]}</span><br />`;
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

function renderIndexes() {

    cdiDetailChecked = JSON.parse(localStorage.getItem(`cdiDetailChecked`))
    dolarDetailChecked = JSON.parse(localStorage.getItem(`dolarDetailChecked`))
    ibovespaDetailChecked = JSON.parse(localStorage.getItem(`ibovespaDetailChecked`))
    ipcaDetailChecked = JSON.parse(localStorage.getItem(`ipcaDetailChecked`))
    igpmDetailChecked = JSON.parse(localStorage.getItem(`igpmDetailChecked`))
    selicDetailChecked = JSON.parse(localStorage.getItem(`selicDetailChecked`))

    var indexes = [[cdiDetailChecked, 'cdi'], [ibovespaDetailChecked, 'ibovespa'], [dolarDetailChecked, 'dolar'], [ipcaDetailChecked, 'ipca'], [igpmDetailChecked, 'igpm'], [selicDetailChecked, 'selic']]

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

}

function renderFilters() {

    var indexes = ['otimo', '1ano', '2anos', 'personalizado']

    for (var i = 0; i < indexes.length; i++) {
        $(`#${indexes[i]}`).toggleClass('clicked', false)
    }

    filterDetailChecked = localStorage.getItem(`filterDetailChecked`)

    $(`#${filterDetailChecked}`).toggleClass('clicked', true)

}

function handleClickIndex(type) {

    var indexTypes = ['cdi', 'dolar', 'ibovespa', 'ipca', 'igpm', 'selic']

    if (indexTypes.includes(type)) {
        var checked = JSON.parse(localStorage.getItem(`${type}DetailChecked`))
        if (checked != null) {
            localStorage.setItem(`${type}DetailChecked`, !checked)
        } else {
            localStorage.setItem(`${type}DetailChecked`, true)
        }
    }

    renderIndexes()

    if (dados != {}) {
        var dataWithColors = dados.map(data => {
            if (data.informacoes.id < 0) {
                return { ...data, color: getItemColor(data.informacoes.id) }
            }
            return data
        })

        carregarGraficos(dataWithColors)
    }
}

function handleClick(type) {

    var element = document.getElementById('dropdown-cont')
    element.classList.remove('flexed');

    var indexTypes = ['otimo', '1ano', '2anos', 'personalizado']

    if (indexTypes.includes(type)) {
        var checked = localStorage.getItem('filterDetailChecked')

        if (checked === type) {
            localStorage.setItem(`filterDetailChecked`, null)
        } else {
            localStorage.setItem(`filterDetailChecked`, type)
        }


        if (type == 'personalizado') {
            var startDate = document.getElementById("initial_date").value;
            var finalDate = document.getElementById("final_date").value;

            setFundDetailData(indexTypes.indexOf(type), startDate, finalDate)
        } else {
            setFundDetailData(indexTypes.indexOf(type))
        }

    }

    renderFilters()

    if (dados != {}) {
        var dataWithColors = dados.map(data => {
            if (data.informacoes.id < 0) {
                return { ...data, color: getItemColor(data.informacoes.id) }
            }
            return data
        })

        carregarGraficos(dataWithColors)
    }
}

function showModalShare() {
    $(modalShare).modal({ backdrop: 'static', keyboard: false })
}

function showModalInvest() {
    Page_ClientValidateReset()
    $(modalInvest).modal({ backdrop: 'static', keyboard: false })
}

function showModalIndicate() {
    $(modalIndicate).modal({ backdrop: 'static', keyboard: false })
}

function showModalIndicateError() {
    $(modalIndicateError).modal({ backdrop: 'static', keyboard: false })
}

function redirectToComparation(urlComparation) {
    var url = '/FundsComparation/GetAllFounds'

    var search = localStorage.getItem("fundDetailCnpj")
    
    let parameters = { removeids: [], requestDTO: { Page: 1, PerPage: 1 }, filter: { Search: search } }

    $.post(url, parameters, function (response) {
        if (response.status) {
            if(response.data.data[0]) {                
                var globalAssetList = []
                globalAssetList.push(response.data.data[0])
                localStorage.setItem('globalAssetList', JSON.stringify(globalAssetList))
                document.location = urlComparation
            }
        }
    });
}

function clearDetails() {
    var movementColumn = $('.column-movement')
    movementColumn.html(`<div> Carregando... </div`)
    var taxColumn = $('.column-tax')
    taxColumn.html('')
    var rescueColumn = $('.column-rescue')
    rescueColumn.html('')
    var indicatorsTable = $('#indicators')
    indicatorsTable.html(`<div style="padding: 0px 0px 32px 32px"> Carregando... </div`)
    var rentabilityGraph = $('#historicalRentabilityTable')
    rentabilityGraph.html(`<div style="padding: 0px 0px 32px 32px"> Carregando... </div`)
    var assetRentabilityGraph = $('#assetsRentabilityTable')
    assetRentabilityGraph.html(`<div style="padding: 0px 0px 32px 32px"> Carregando... </div`)
    var consistenciaGraph = $('#consistenciaTable')
    consistenciaGraph.html(`<div style="padding: 0px 0px 32px 32px"> Carregando... </div`)
    var retangleCotista = $('.retangle-cotistas')
    retangleCotista.html('');
    var retangleDrawDown = $('.retangle-drawdown')
    retangleDrawDown.html('');
    var retanglePatrimonio = $('.retangle-patrimonio')
    retanglePatrimonio.html('');
    var retangleVolatilidade = $('.retangle-volatilidade')
    retangleVolatilidade.html('');

    // * GRAFICO DE RENTABILIDADE
    rentabilChart.updateSeries([{data: []}])        

    // * GRAFICO COTISTAS
    cotistasChart.updateSeries([{data: []}])

    // * GRAFICO DRAWDOWN
    drawdownChart.updateSeries([{data: []}])

    // * GRAFICO PATRIMONIO
    patrimonioChart.updateSeries([{data: []}])

    // * GRAFICO VOLATILIDADE
    volatilidadeChart.updateSeries([{data: []}])

}

function setHeaderDetailData() {
    var id = localStorage.getItem("fundDetailCnpj")
    let parameters = { cnpj: id }
    let url = "/FundDetail/GetFundDetail"
    
    $.get(url, parameters, function (response) {
        
        if (response.data) {
            dados = response.data
            var fundTitle = response.data[0].informacoes.razaoSocial

            localStorage.setItem("fundTitle", fundTitle)
            localStorage.setItem("fundDetails", JSON.stringify(response.data[0].informacoes))
            localStorage.setItem("fundDetailsFunds", JSON.stringify(response.data))

            if (response.data) {

                fillTitle()
                fillHeaderDetails()
                // fillDataSheet(dataWithColors)
                // fillIndicatorsTable(dataWithColors)
                // fillHistoricalRentability(dataWithColors)
                // fillAssetsRentability(dataWithColors)
                // fillConsistencyTable(dataWithColors)
                // carregarGraficos(dataWithColors)
            }

            LoadingOFF()
        }
    } )
}

function showModalNotMatch() {
    $(modalNotMatch).modal({ backdrop: 'static', keyboard: false })
}

function setFundDetailData(filterType, initialDate, finalDate) {
    var id = localStorage.getItem("fundDetailCnpj")


    let parameters = { cnpj: id, FilterType: filterType ? filterType : 0, InitialDate: initialDate ? initialDate : "", FinalDate: finalDate ? finalDate : "" }
    let url = "/FundDetail/GetFundReports"

    $.get(url, parameters, function (response) {
        if ((initialDate || finalDate) && response.responseText == 'no content') {
            return showModalNotMatch()
        }
        if (response.data) {

            dados = response.data
            var fundTitle = response.data[0].informacoes.razaoSocial

            localStorage.setItem("fundTitle", fundTitle)

            localStorage.setItem("fundDetails", JSON.stringify(response.data[0].informacoes))
            localStorage.setItem("fundDetailsFunds", JSON.stringify(response.data))

            if (response.data) {
                var dataWithColors = response.data.map(data => {
                    if (data.informacoes.id < 0) {
                        return { ...data, color: getItemColor(data.informacoes.id) }
                    }
                    return data
                })

                fillTitle()
                fillHeaderDetails()
                fillDataSheet(dataWithColors)
                fillIndicatorsTable(dataWithColors)
                fillHistoricalRentabilityCDI(dataWithColors)
                fillHistoricalRentabilityIbovespa(dataWithColors)
                fillAssetsRentability(dataWithColors)
                fillConsistencyTable(dataWithColors)
                carregarGraficos(dataWithColors)
            }

            LoadingOFF()
        }
    })
    
}
function setFavoritedFundInfo() {
    var id = localStorage.getItem("fundDetailCnpj")
    var userId = localStorage.getItem("userId")
    if(!id || !userId || userId == `null`) {
        return
    }
    $.get(`/favorite-funds/favorited?cnpj=${id}&userID=${userId}`, function (response) {
        if(response) {
            localStorage.setItem('favoriteAsset', response)
            fillTitle()
        } else {
            localStorage.setItem('favoriteAsset', false)
            fillTitle()
        }
    
    })
    
}

function showModalFavorite(isFavorite) {
    $(modalFavorite).modal({ backdrop: 'static', keyboard: false })
    $(modalFavoriteBody).html(`${isFavorite?`Fundo favoritado com sucesso.`:`Fundo removido dos favoritos com sucesso.`}`)
}

function showModalFavoriteError() {
    $(modalFavoriteError).modal({ backdrop: 'static', keyboard: false })
}

//update with the endpoint 
function handleFavorite() {
    var id = localStorage.getItem("fundDetailCnpj")
    var userId = localStorage.getItem("userId")
    if(!id || !userId || userId == `null`) {
        return
    }    
    var stateBeforeClick = $('#favoriteBtnImg').attr("src").includes("filled")
    var isClicked = !stateBeforeClick
    if(isClicked) {
        $.post(`/favorite-funds/add?cnpj=${id}&userID=${userId}`, function (response) {
            if(response.status) {
                localStorage.setItem('favoriteAsset', true)
                fillTitle()
                showModalFavorite(true)
            } else {
                localStorage.setItem('favoriteAsset', false)
                fillTitle()
                showModalFavoriteError()
            }
            
        })    
    } else {
        $.ajax({
            url: `/favorite-funds/delete?cnpj=${id}&userID=${userId}`,
            type: 'DELETE',
        }).done(function(response) {
            if(response.status) {
                localStorage.setItem('favoriteAsset', false)
                fillTitle()
                showModalFavorite(false)
            } else {
                localStorage.setItem('favoriteAsset', true)
                showModalFavoriteError()
                fillTitle()
            }
        });
    }
}

//update when the output from the details endpoint comes
function fillTitle() {
    var title = $('#fund-detail-title')
    title.html('')

    var titleText = localStorage.getItem("fundTitle")
    
    if(!titleText) titleText = "Detalhes do Fundo";

    var isFavorite = localStorage.getItem('favoriteAsset') === true || localStorage.getItem('favoriteAsset') == 'true' 

    var headerRow = `<div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between">`
    var fundTitle = `<div id="title-fund" style="width: 50%"><div style="max-width: 90%; padding-right: 15px">${titleText}</div></div>`
    var buttonsRow = `<div class="buttonsRow" style="display: flex; flex-direction: row; justify-content: space-between; gap: 8px;">`
    var compareBtn = `<button id="compareBtn" style="display: flex; gap: 8px; max-width: 213px; flex-direction: row; justify-content: center; align-items: center; padding: 12px 16px; height: 40px; background: #173232; border-radius: 10px; border: none">
                        <img style="width: 13px; height: 13px" src="/Images/plus_button.svg" />
                        <div class="compare-label" style="color: #fff; font-size: 12px" onclick="redirectToComparation('/FundsComparation')">Comparar com outro fundo</div>
                      </button>`
    var investBtn = `<button id="investBtn" style="display: flex; gap: 8px; max-width: 213px; flex-direction: row; justify-content: center; align-items: center; padding: 12px 16px; height: 40px; background: #C5B8A2; border-radius: 10px; border: none" onclick="showModalInvest()">
                        <img style="width: 13px; height: 13px" src="/Images/cart_button.svg" />
                        <div class="invest-label" style="color: #fff; font-size: 12px">Investir nesse fundo</div>
                      </button>`
    var favoriteBtn = `<button id="favoriteBtn" style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 12px 16px; gap: 8px; width: 50px; height: 40px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px;" onclick="handleFavorite()">
                        ${isFavorite? `<img id="favoriteBtnImg" style="width: 13px; height: 13px" src="/Images/filled_heart.svg" />` : `<img id="favoriteBtnImg" style="width: 13px; height: 13px" src="/Images/heart.svg" />`}
                      </button>`
    var shareBtn = `<button id="shareBtn" style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 12px 16px; gap: 8px; width: 50px; height: 40px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px;" onclick="showModalShare()">
                        <img style="width: 13px; height: 13px" src="/Images/share.svg" />
                      </button>`
    var header = headerRow + fundTitle + buttonsRow + compareBtn + investBtn + favoriteBtn + shareBtn + `</div>` + `</div>`
    title.append(header)
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

//Tabela de principais indicadores <-- update when the output from the details endpoint comes -->
function fillIndicatorsTable(data) {
    var corpo
    var indicator
    var indicatorsTable = $('#indicators')
    indicatorsTable.html('')

    data.map(function (item) {
        if (item.principaisIndicadores.rentabilidade12M) {
            corpo += `
                    <tr class="table-row" id="rh_${item.informacoes?.id}" style="height: 80px">
                        <td style="padding-left: 40px" class="flex-item ${item.principaisIndicadores?.rentabilidade12M < 0 ? "red-percent" : "normal-percent"}">${item.principaisIndicadores?.rentabilidade12M.toFixed(2).replace('.', ',')}%</td>
                        <td class="flex-item">R$ ${maskYaxis(item.principaisIndicadores?.patrimonioLiquido)}</td>
                        <td class="flex-item">R$ ${maskYaxis(item.principaisIndicadores?.patrimonioLiquidoMedio12M)}</td>
                        <td class="flex-item ${item.principaisIndicadores?.volatilidade12Mh < 0 ? "red-percent" : "normal-percent"}">${item.principaisIndicadores?.volatilidade12M.toFixed(2).replace('.', ',')}%</td>
                        <td class="flex-item ${item.principaisIndicadores?.indiceSharpe12M < 0 ? "red-percent" : "normal-percent"}">${item.principaisIndicadores?.indiceSharpe12M.toFixed(2).replace('.', ',')}%</td>
                        <td class="flex-item">${maskYaxis(item.principaisIndicadores?.cotistas)}</td>
                    </tr>
                `
        }
    })

    indicator = `<thead>
                    <tr class="table-row">
                        <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Rentabilidade 12M</div></th>
                        <th><div class="actives-table">Patrimônio Líquido</div></th>
                        <th><div class="actives-table">PL Médio 12M</div></th>
                        <th><div class="actives-table">Volatilidade 12M</div></th>
                        <th><div class="actives-table">Índice de Sharpe 12M</div></th>
                        <th><div class="actives-table">Cotistas</div></th>
                    </tr>
                </thead>
                    ${corpo}`

    indicatorsTable.append(indicator)

    if (!cdiDetailChecked) {
        $("#rh_-1").toggle()
    }

    if (!dolarDetailChecked) {
        $("#rh_-2").toggle()
    }

    if (!ipcaDetailChecked) {
        $("#rh_-3").toggle()
    }
    if (!igpmDetailChecked) {
        $("#rh_-4").toggle()
    }

    if (!selicDetailChecked) {
        $("#rh_-5").toggle()
    }

}


//Tabela Rentabilidade Histórica CDI
function fillHistoricalRentabilityCDI(data) {
    var rentability
    var corpo
    var monthsArray = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Ano', 'Acum.']
    var rentabilityGraph = $('#historicalRentabilityCDITable')
    rentabilityGraph.html('')

    var cdiList = []
    data[1]?.rentabilidadeMensalPorAno.map(function (item) {
        if (data[0]?.rentabilidadeMensalPorAno.find((x) => x.ano === item.ano)) {
            cdiList.push(item)
        }
    })

    data[0]?.rentabilidadeMensalPorAno.map(function (item) {
        var yearOnCdiList = cdiList.find(cdi => cdi.ano == item.ano)
        var tableData = ``

        for (var i = 0; i < monthsArray.length; i++) {
            var value = item.valores.find(val => val.descricao.includes(monthsArray[i]))
            var valueCdi = yearOnCdiList.valores.find(val => val.descricao.includes(monthsArray[i]))

            var formattedValue = value?.valor.toFixed(2).replace('.', ',')
            var formattedValueCdi = valueCdi?.valor.toFixed(2).replace('.', ',')

            if (value && valueCdi) {
                tableData += `<td class="flex-item ${value.valor < 0 ? "red-percent" : "normal-percent"}">${formattedValue}<br /><small class="${valueCdi.valor < 0 ? "red-percent" : "cdi-percent"}">${formattedValueCdi}</small></td>`
            } else if (value && !valueCdi) {
                tableData += `<td class="flex-item ${value.valor < 0 ? "red-percent" : "normal-percent"}">${formattedValue}<br /><small class="cdi-percent">-</small></td>`
            } else if (!value && valueCdi) {
                tableData += `<td class="flex-item">-<br /><small class="${valueCdi.valor < 0 ? "red-percent" : "cdi-percent"}">${formattedValueCdi}</small></td>`
            } else {
                tableData += `<td class="flex-item normal-percent">-<br /><small class="cdi-percent">-</small></td>`
            }
        }
        corpo += `
                <tr class="table-row" id="cons_${data[0].informacoes?.id}" style="height: 60px">
                   
                    <td style="padding-left: 40px; color: #637692" class="flex-item">${item.ano}</td>
                    <td style="padding-right: 20px;>
                        <div class="row" style="align-items: center; flex-flow: column">
                                <div style="color: #637692; font-weight: 500 !important" class="card-title">Fundo</div>
                                <div style="color: #637692; font-weight: 500 !important" class="card-title">% CDI</div>
                            </div>
                        </div>
                    </td>
                    ${tableData}`
    })

    rentability = `
            <thead>
                <tr class="table-row">
                    <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Ano</div></th>
                    <th><div class="actives-table"></div></th>
                    <th><div class="actives-table">Jan</div></th>
                    <th><div class="actives-table">Fev</div></th>
                    <th><div class="actives-table">Mar</div></th>
                    <th><div class="actives-table">Abr</div></th>
                    <th><div class="actives-table">Mai</div></th>
                    <th><div class="actives-table">Jun</div></th>
                    <th><div class="actives-table">Jul</div></th>
                    <th><div class="actives-table">Ago</div></th>
                    <th><div class="actives-table">Set</div></th>
                    <th><div class="actives-table">Out</div></th>
                    <th><div class="actives-table">Nov</div></th>
                    <th><div class="actives-table">Dez</div></th>
                    <th><div class="actives-table">Ano</div></th>
                    <th><div class="actives-table">Acum.</div></th>
                </tr>
            </thead>
             ${corpo}`

    rentabilityGraph.append(rentability)
}

//Tabela Rentabilidade Histórica IBOVESPA
function fillHistoricalRentabilityIbovespa(data) {
    var rentability
    var corpo
    var monthsArray = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Ano', 'Acum.']
    var rentabilityGraph = $('#historicalRentabilityIbovTable')
    rentabilityGraph.html('')

    var ibovList = []
    data[2]?.rentabilidadeMensalPorAno.map(function (item) {
        if (data[0]?.rentabilidadeMensalPorAno.find((x) => x.ano === item.ano)) {
            ibovList.push(item)
        }
    })

    data[0]?.rentabilidadeMensalPorAno.map(function (item) {
        var yearOnIbovespaList = ibovList.find(ibov => ibov.ano == item.ano)
        var tableData = ``

        for (var i = 0; i < monthsArray.length; i++) {
            var value = item.valores.find(val => val.descricao.includes(monthsArray[i]))
            var valueIbov = yearOnIbovespaList.valores.find(val => val.descricao.includes(monthsArray[i]))

            var formattedValue = value?.valor.toFixed(2).replace('.', ',')
            var formattedValueIbov = valueIbov?.valor.toFixed(2).replace('.', ',')

            if (value && valueIbov) {
                tableData += `<td class="flex-item ${value.valor < 0 ? "red-percent" : "normal-percent"}">${formattedValue}<br /><small class="${valueIbov.valor < 0 ? "red-percent" : "ibov-percent"}">${formattedValueIbov}</small></td>`
            } else if (value && !valueIbov) {
                tableData += `<td class="flex-item ${value.valor < 0 ? "red-percent" : "normal-percent"}">${formattedValue}<br /><small class="ibov-percent">-</small></td>`
            } else if (!value && valueIbov) {
                tableData += `<td class="flex-item">-<br /><small class="${valueIbov.valor < 0 ? "red-percent" : "ibov-percent"}">${formattedValueIbov}</small></td>`
            } else { 
                tableData += `<td class="flex-item normal-percent">-<br /><small class="ibov-percent">-</small></td>`
            }
        }
        corpo += `
                <tr class="table-row" id="cons_${data[0].informacoes?.id}" style="height: 60px">
                   
                    <td style="padding-left: 40px; color: #637692" class="flex-item">${item.ano}</td>
                    <td style="padding-right: 20px;>
                        <div class="row" style="align-items: center; flex-flow: column">
                                <div style="color: #637692; font-weight: 500 !important" class="card-title">Fundo</div>
                                <div style="color: #637692; font-weight: 500 !important" class="card-title">p.p IBOV</div>
                            </div>
                        </div>
                    </td>
                    ${tableData}`
    })

    rentability = `
            <thead>
                <tr class="table-row">
                    <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table">Ano</div></th>
                    <th><div class="actives-table"></div></th>
                    <th><div class="actives-table">Jan</div></th>
                    <th><div class="actives-table">Fev</div></th>
                    <th><div class="actives-table">Mar</div></th>
                    <th><div class="actives-table">Abr</div></th>
                    <th><div class="actives-table">Mai</div></th>
                    <th><div class="actives-table">Jun</div></th>
                    <th><div class="actives-table">Jul</div></th>
                    <th><div class="actives-table">Ago</div></th>
                    <th><div class="actives-table">Set</div></th>
                    <th><div class="actives-table">Out</div></th>
                    <th><div class="actives-table">Nov</div></th>
                    <th><div class="actives-table">Dez</div></th>
                    <th><div class="actives-table">Ano</div></th>
                    <th><div class="actives-table">Acum.</div></th>
                </tr>
            </thead>
             ${corpo}`

    rentabilityGraph.append(rentability)
}

//Tabela de Índices de rentabilidade
function fillAssetsRentability(data) {
    var rentability
    var corpo
    var rentabilityGraph = $('#assetsRentabilityTable')
    rentabilityGraph.html('')

    if (data[0]) {
        var itemRent = data[0].indicesDeRentabilidade?.rentabilidade
        var itemVol = data[0].indicesDeRentabilidade?.volatilidade
        var itemSharpe = data[0].indicesDeRentabilidade?.indiceSharpe

            corpo += `
                    <tr class="table-row" style="height: 60px">
                    <td style="padding-left: 40px">
                        <div class="row" style="align-items: center">
                            <div href="#" rel="tooltip" data-placement="top" title="Rentabilidade">
                                <div class="card-title">Rentabilidade</div>
                            </div>
                        </div>
                    </td>
                    <td class="flex-item ${itemRent.noAno < 0 ? "red-percent" : "normal-percent"}">${itemRent.noAno.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemRent.noMes < 0 ? "red-percent" : "normal-percent"}">${itemRent.noMes.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemRent.ultimos12Meses < 0 ? "red-percent" : "normal-percent"}">${itemRent.ultimos12Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemRent.ultimos24Meses < 0 ? "red-percent" : "normal-percent"}">${itemRent.ultimos24Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemRent.ultimos36Meses < 0 ? "red-percent" : "normal-percent"}">${itemRent.ultimos36Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemRent.total < 0 ? "red-percent" : "normal-percent"}">${itemRent.total.toFixed(2).replace('.', ',') }%</td>
            `

            corpo += `
                    <tr class="table-row" style="height: 60px">
                    <td style="padding-left: 40px">
                        <div class="row" style="align-items: center">
                            <div href="#" rel="tooltip" data-placement="top" title="Volatilidade">
                                <div class="card-title">Volatilidade</div>
                            </div>
                        </div>
                    </td>
                    <td class="flex-item ${itemVol.noAno < 0 ? "red-percent" : "normal-percent"}">${itemVol.noAno.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemVol.noMes < 0 ? "red-percent" : "normal-percent"}">${itemVol.noMes.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemVol.ultimos12Meses < 0 ? "red-percent" : "normal-percent"}">${itemVol.ultimos12Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemVol.ultimos24Meses < 0 ? "red-percent" : "normal-percent"}">${itemVol.ultimos24Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemVol.ultimos36Meses < 0 ? "red-percent" : "normal-percent"}">${itemVol.ultimos36Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemVol.total < 0 ? "red-percent" : "normal-percent"}">${itemVol.total.toFixed(2).replace('.', ',') }%</td>
            `

            corpo += `
                    <tr class="table-row" style="height: 60px">
                    <td style="padding-left: 40px">
                        <div class="row" style="align-items: center">
                            <div href="#" rel="tooltip" data-placement="top" title="Índice Sharpe">
                                <div class="card-title">Índice Sharpe</div>
                            </div>
                        </div>
                    </td>
                    <td class="flex-item ${itemSharpe.noAno < 0 ? "red-percent" : "normal-percent"}">${itemSharpe.noAno.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemSharpe.noMes < 0 ? "red-percent" : "normal-percent"}">${itemSharpe.noMes.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemSharpe.ultimos12Meses < 0 ? "red-percent" : "normal-percent"}">${itemSharpe.ultimos12Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemSharpe.ultimos24Meses < 0 ? "red-percent" : "normal-percent"}">${itemSharpe.ultimos24Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemSharpe.ultimos36Meses < 0 ? "red-percent" : "normal-percent"}">${itemSharpe.ultimos36Meses.toFixed(2).replace('.', ',') }%</td>
                    <td class="flex-item ${itemSharpe.total < 0 ? "red-percent" : "normal-percent"}">${itemSharpe.total.toFixed(2).replace('.', ',') }%</td>
            `

        rentability = `
                <thead>
                    <tr class="table-row">
                        <th><div class="actives-table"></div></th>
                        <th><div class="actives-table">Ano</div></th>
                        <th><div class="actives-table">1 Mês</div></th>
                        <th><div class="actives-table">12 Meses</div></th>
                        <th><div class="actives-table">24 Meses</div></th>
                        <th><div class="actives-table">36 Meses</div></th>
                        <th><div class="actives-table">Total</div></th>
                    </tr>
                </thead>
                 ${corpo}`

        rentabilityGraph.append(rentability)

    }
}

//Tabela de consistência
function fillConsistencyTable(data) {
    var consistencia
    var corpo
    var consistenciaGraph = $('#consistenciaTable')
    consistenciaGraph.html('')

    data.map(function (item) {
        if (item.informacoes?.id >= 0) {
            corpo += `
                    <tr class="table-row" id="cons_${item.informacoes?.id}" style="height: 60px">
                    <td style="padding-left: 40px">
                        <div class="row" style="align-items: center">
                            <div href="#" rel="tooltip" data-placement="top" title="${item.informacoes.razaoSocial}">
                                <div class="card-title">${item.informacoes.razaoSocial.length > 15 ? item.informacoes.razaoSocial.substring(0, 15) : item.informacoes.razaoSocial}</div>
                            </div>
                        </div>
                    </td>
                    <td class="flex-item">${item.consistencia?.positiveMonths}</td>
                    <td class="flex-item">${item.consistencia?.negativeMonths}</td>
                    <td class="flex-item ${item.consistencia?.majorReturn < 0 ? "red-percent" : "normal-percent"}">${item.consistencia?.majorReturn.toFixed(2).replace('.', ',')}%</td>
                    <td class="flex-item ${item.consistencia?.minorReturn < 0 ? "red-percent" : "normal-percent"}">${item.consistencia?.minorReturn.toFixed(2).replace('.', ',')}%</td>
                    <td class="flex-item">${item.consistencia?.cdiUp}</td>
                    <td class="flex-item">${item.consistencia?.cdiDown}</td>`
        }
    })

    consistencia = `
            <thead>
                <tr class="table-row">
                    <th style="padding-left: 40px; margin-left: 15px"><div class="actives-table"></div></th>
                    <th><div class="actives-table">Meses Positivo</div></th>
                    <th><div class="actives-table">Meses Negativos</div></th>
                    <th><div class="actives-table">Maior Retorno</div></th>
                    <th><div class="actives-table">Menor Retorno</div></th>
                    <th><div class="actives-table">Acima CDI</div></th>
                    <th><div class="actives-table">Abaixo CDI</div></th>
                </tr>
            </thead>
             ${corpo}`

    consistenciaGraph.append(consistencia)

    if (!cdiDetailChecked) {
        $("#cons_-1").toggle()
    }

    if (!ibovespaDetailChecked) {
        $("#cons_-2").toggle()
    }

    if (!dolarDetailChecked) {
        $("#cons_-3").toggle()
    }

    if (!ipcaDetailChecked) {
        $("#cons_-4").toggle()
    }

    if (!igpmDetailChecked) {
        $("#cons_-5").toggle()
    }

    if (!selicDetailChecked) {
        $("#cons_-6").toggle()
    }
}

//update when the output from the details endpoint comes
function fillHeaderDetails() {
    var details = JSON.parse(localStorage.getItem("fundDetails"))

    var firstTable = $('#first-table')
    firstTable.html('')
    var secondTable = $('#second-table')
    secondTable.html('')
    var id = 0
    var firstTableContext = ` 
        <thead>
            <tr class="table-row">
                <th style="padding-left: 36px"><h1 class="actives" style="padding: 0; margin: 0">Data Inicial</h1></th>
                <th style=""><h1 class="actives" style="padding: 0; margin: 0">Razão Social</h1></th>
                <th style=""><h1 class="actives" style="padding: 0; margin: 0">CNPJ</h1></th>
                <th style=""><h1 class="actives" style="padding: 0; margin: 0">Benchmark</h1></th>
            </tr>
        </thead>
        <tr class="table-row" id="rh_${id}" style="height: 100px">
            <td class="flex-item" style="width: 20%; padding-left: 36px; font-weight: 400">${details.dataInicial}</td>
            <td class="flex-item" style="width: 40%; font-weight: 400"><div style="width: 90%">${details.razaoSocial}</div></td>
            <td class="flex-item" style="width: 20%; font-weight: 400">${details.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</td>
            <td class="flex-item" style="width: 20%; font-weight: 400">CDI</td>
        </tr>` 

    firstTable.append(firstTableContext)

    var secondTableContext = ` 
        <thead>
            <tr class="table-row">
                <th style="padding-left: 36px"><h1 class="actives" style="padding: 0; margin: 0">Tipo do Fundo</h1></th>
                <th style=""><h1 class="actives" style="padding: 0; margin: 0">Administrador</h1></th>
                <th style="padding: 0"><h1 class="actives" style="padding: 0; margin: 0">Classe</h1></th>
                <th ><h1 class="actives" style="padding: 0; margin: 0">Gestor</h1></th>
            </tr>
        </thead>
<tbody
        <tr class="table-row" id="rh_${id}" style="height: 100px">
            <td class="flex-item" style="width: 20%; padding-left: 36px; font-weight: 400">FC</td>
            <td class="flex-item" style="width: 40%; font-weight: 400"><div style="width: 90%; font-weight: 400">${details.administrador}</div></td>
            <td class="flex-item" style="wwidth: 20%; font-weight: 400"><div style="width: 90%; font-weight: 400">${details.classeAnbima}</div></td>
            <td class="flex-item" style="width: 20%; font-weight: 400">${details.gestor}</td>
        </tr>`

    secondTable.append(secondTableContext)
}

function fillDataSheet(data) {
    var movementColumn = $('.column-movement')
    movementColumn.html('')
    var taxColumn = $('.column-tax')
    taxColumn.html('')
    var rescueColumn = $('.column-rescue')
    rescueColumn.html('')

    if (data) {
        var item = data[0].fichaTecnica
        var formattedContribution = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.aporteMinimo).toString().replace('€', '')
        var formattedStay = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.valorMinimoPermanencia).toString().replace('€', '')

        var movementContext = ` 
            <h2>Movimentação</h2>
            <p>Aporte Mínimo</p>    
            <input value="R$ ${formattedContribution}" disabled/>

            <p class="spacing">Valor Mínimo para Permanência</p>    
            <input value="R$ ${formattedStay}" disabled/>
        `
        movementColumn.append(movementContext)

        var taxContext = `
            <h2>Taxas</h2>
            <p>Taxas de Adm</p>    
            <input value="${item.taxaAdministrativa?.toFixed(2)?.replace('.', ',')}% a.a." disabled/>

            <p class="spacing">Taxa de Adm Máx</p>    
            <input value="${item.taxaAdministrativaMaxima?.toFixed(2)?.replace('.', ',')}% a.a." disabled/>

            <p class="spacing">Taxa de Performance</p>    
            <input value="${item.taxaDePerformance?.toFixed(2)?.replace('.', ',')}" disabled/>
        `
        taxColumn.append(taxContext)

        var rescueContext = `
            <h2>Resgate</h2>
            <p>Prazo de Cotização</p>    
            <input value="${item.prazoDeCotizacao}" disabled/>

            <p class="spacing">Liquidação Financeira</p>    
            <input value="${item.liquidãçãoFinanceira}" disabled/>
        `
        rescueColumn.append(rescueContext)
    }
}

function fillShareLink(url) {
    var element = $('.copy-label')
    element.html('')

    var copyButton = `<p onclick="handleCopy('${url}')">Copiar</p>`

    element.append(`<p class="url" style="margin: 0; align-self: center; color: #637692; font-weight: 400">${url}</p>` + copyButton)
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

function handleCopy(url) {
    var x = $("#snackbar");
    x.toggleClass('show');
    navigator.clipboard.writeText(url);
}

function hideSnackBar() {
    var x = $("#snackbar");
    x.toggleClass("show");
}

function shareTwitter() {
    var text = 'Acesse já o site da SACRE e verifique este fundo: '
    window.open('http://twitter.com/share?url=' + window.location + '&text=' + text, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
}

function shareFacebook() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + window.location + '&amp');
}

function shareLinkedin() {
    window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + window.location + '&title=Fundo de Investimento&summary=Acesse%20ja%20o%20site%20da%20SACRE%20e%20verifique%20este%20fundo&source=LinkedIn')
}

function shareEmail() {
    window.open('mailto:' + '' + `?subject=Acesse este fundo de investimento&body=${window.location}`)
}

function shareTelegram() {
    window.open('https://telegram.me/share/url?url=' + window.location + '&text=Acesse este fundo de investimento')
}

function shareWhatsapp() {
    window.open('https://web.whatsapp.com://send?text=Acesse este fundo de investimento' + `${window.location}`)
}

function carregarGraficos(datasource) {
    // * Gráfico de Rentabilidade
    carregarDadosGraficoRentabilidade(datasource)

    // * Gráfico de Cotistas
    carregarDadosCotistas(datasource)

    // * Gráfico de Drawdown
    carregarDadosDrawdown(datasource)

    // * Gráfico de Patrimônio
    carregarDadosPatrimonio(datasource)

    // * Gráfico de Volatilidade
    carregarDadosVolatilidade(datasource)

    // * Preencher o campo Atual de cada gráfico
    fillActuals(datasource)
}

function fillActuals(datasource) {
    var retangleCotista = $('.retangle-cotistas')
    retangleCotista.html('');
    var retangleDrawDown = $('.retangle-drawdown')
    retangleDrawDown.html('');
    var retanglePatrimonio = $('.retangle-patrimonio')
    retanglePatrimonio.html('');
    var retangleVolatilidade = $('.retangle-volatilidade')
    retangleVolatilidade.html('');

    retangleCotista.append(`
                    <div class="retangle ${localStorage.getItem('fundDetailColor')}"></div>
                    <div class="card-header">
                        <h5 class="card-title">Atual</h5>
                        <p class="actual-cotistas">${maskYaxis(datasource[0].cotistaAtual)}</p>
                    </div>`)
    retangleDrawDown.append(`
                    <div class="retangle ${localStorage.getItem('fundDetailColor')}"></div>
                    <div class="card-header">
                        <h5 class="card-title">Atual</h5>
                        <p class="actual-drawdown">${datasource[0].drawDownAtual}%</p>
                    </div>`)
    retanglePatrimonio.append(`
                    <div class="retangle ${localStorage.getItem('fundDetailColor')}"></div>
                    <div class="card-header">
                        <h5 class="card-title">Atual</h5>
                        <p class="actual-patrimonio">${maskYaxis(datasource[0].patrimonioAtual)}</p>
                    </div>`)
    retangleVolatilidade.append(`
                    <div class="retangle ${localStorage.getItem('fundDetailColor')}"></div>
                    <div class="card-header">
                        <h5 class="card-title">Atual</h5>
                        <p class="actual-volatilidade">${maskYaxis(datasource[0].volatilidadeAtual)}%</p>
                    </div>`)
}

function Page_ClientValidateReset() {
    if (typeof (Page_Validators) != "undefined") {
        for (var i = 0; i < Page_Validators.length; i++) {
            var validator = Page_Validators[i];
            validator.isvalid = true;
            ValidatorUpdateDisplay(validator);
        }
    }
}

function maskTel(v) {
    v.value = v.value.replace(/\D/g, "");
    v.value = v.value.replace(/^(\d\d)(\d)/g, "($1) $2");
    v.value = v.value.replace(/(\d{5})(\d)/, "$1-$2");
    return v;
}

function indicateAsset() {
    var email = $('#email').val()
    var contact = $('#contact').val()
    var name = $('#name').val()
    var liquity = $('#liquity').val()
    var isInvestor = verifyInvestor()
    
    let url = "/IndicateAsset/Indicate"
     let parameters = {
        Name: name,
        Email: email,
        Contact: contact,
        Liquity: liquity,
        IsInvestor: isInvestor==='yes'?true:false,
    }
    $.post(url, parameters, function (response) { 
        if (response.status) { 
            showModalIndicate()
        } else {
            showModalIndicateError()
        }
    });
}

function validateName() {
    var name = $('#name')
    if (!isNameValid(name.val())) {
        $('#name-error').html('O nome deve conter apenas caracteres ASCII')
    } else {
        $('#name-error').html('')
    }
    checkForSubmitButton()
}
function validateEmail() {
    var email = $('#email')
    if (!isValidEmail(email.val())) {
        $('#email-error').html('Email inválido')
    } else {
        $('#email-error').html('')
    }
    checkForSubmitButton()
}
function validateContact() {
    var contact = $('#contact')
    if(!isValidContact(contact.val())) {
        $('#contact-error').html('Contato inválido')
    } else {
        $('#contact-error').html('')
    }
    checkForSubmitButton()
}
function checkForSubmitButton() {
    if(isValidEmail($('#email').val()) 
        && isValidContact($('#contact').val()) 
        && isNameValid($('#name').val())
        && verifyInvestor()
    ) {
        $('#submitInvestimentButton').removeClass('faded')    
    } else {
        $('#submitInvestimentButton').addClass('faded')    
    }
}
    

// var isInvestorMarked = $('is-investor-marked').hasClass('')
// var isInvestorNotMarked = $('is-investor-not-marked').hasClass('')
function isValidContact(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d\d)(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    return v.length >= 15
}

function isValidEmail(email) {
    return email.match(/^[\.a-zA-Z0-9\-_]+@[\.a-zA-Z\d\-_]+\.[a-zA-Z\d\-_]+$/)
}

function isNameValid(val) {
    return isASCII(val) && val.length > 0;
}

function isASCII(text) {
    return text.match(/^[\x00-\x7F]*$/)
}

function verifyInvestor() {
    var investorYes = $('#yes')
    var investorNo = $('#no')
    if (investorYes[0].checked) return 'yes'
    if (investorNo[0].checked) return 'no'
    return null
}

function isValidInvestor(id) {
    var myCheckbox = document.getElementsByName("myCheckbox");
    Array.prototype.forEach.call(myCheckbox, function (el) {
        el.checked = false;
    });
    id.checked = true;    
    
    checkForSubmitButton()
}