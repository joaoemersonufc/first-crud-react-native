const colorList = ["yellowgreen","yellow","violet","turquoise","tomato","teal","tan","steelblue","springgreen","slategray","slateblue","skyblue","sienna","seagreen","sandybrown","salmon","saddlebrown","royalblue","rosybrown","red","purple","plum","pink","peru","palevioletred","paleturquoise","palegreen","orchid","orangered","orange","olivedrab","olive", "navy","moccasin","midnightblue","mediumvioletred","mediumturquoise","mediumspringgreen","mediumslateblue","mediumseagreen","mediumpurple","mediumorchid","mediumblue","mediumaquamarine","maroon","magenta","limegreen","lime","lightsteelblue","lightslategray","lightskyblue","lightseagreen","lightsalmon","lightpink","lightgreen","lightcoral","lightblue", "lawngreen","khaki","indigo","indianred","hotpink","greenyellow","green","gray","goldenrod","gold","fuchsia","forestgreen","firebrick","dodgerblue","dimgray","deepskyblue","deeppink","darkviolet","darkturquoise","darkslategray","darkslateblue","darkseagreen","darkorchid","darkorange","darkolivegreen","darkmagenta", "darkkhaki","darkgreen","darkgray","darkcyan","darkblue","cyan","crimson","cornflowerblue","coral","chocolate","chartreuse","cadetblue","burlywood","brown","blueviolet","blue","black","aquamarine","aqua"]

function getItemColor(id) {
    var items = getItems()

    var possibleItem = items.find(x => x.id === id)

    if (possibleItem) {
        return possibleItem.color
    }

    var availableColorList = getAvailableColorList(items)

    var randomColor = availableColorList[Math.floor(Math.random() * availableColorList.length)]

    addItem({id: id, color: randomColor})
    return randomColor
}

function addItem(item) {
    var items = getItems()
    var possibleItem = items.find(i => {
        return i.id === item.id
    })

    if (possibleItem) {
        items.splice(possibleItem, 1)
    }
    items.push(item)
    localStorage.setItem("itemColors", JSON.stringify(items))
}

function getItems() {
    var result = localStorage.getItem("itemColors")
    if (result) return JSON.parse(result)
    return []
}

function getAvailableColorList(items) {
    if (!items) return colorList;
    var unavailableColors = items.map(function (i) {
        return i.color
    })

    var availableColors = colorList
    availableColors = availableColors.filter( function( el ) {
        return unavailableColors.indexOf( el ) < 0;
    } );
    return availableColors;
}