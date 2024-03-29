'use strict';

var _match = function(pattern, text, offset, options) {
    var insertions = 0;
    var matchIndexes = [];
    var iPattern = 0;
    for (var iText = offset; iText < text.length; iText++) {
        if (text[iText] === pattern[iPattern]) {
            matchIndexes.push(iText);
            if (++iPattern === pattern.length) {
                return ({
                    insertions: insertions,
                    matchIndexes: matchIndexes,
                });
            }
        } else if (matchIndexes.length) {
            insertions++;
            if (options.maxInsertions > -1 &&
                insertions > options.maxInsertions) {
                return null;
            }
        }
    }
    return null;
};
var _find = function(pattern, text, options) {
    var match = false;
    var insertions = null;
    var matchIndexes = null;
    var iPattern = 0;
    if (options.caseSensitive === false) {
        pattern = pattern.toLowerCase();
        text = text.toLowerCase();
    }
    for (var iText = 0; iText < text.length; iText++) {
        if (text[iText] === pattern[iPattern]) {
            var res = _match(pattern, text, iText, options);
            if (res && (match === false || res.insertions <= insertions)) {
                if (match === false || res.insertions < insertions) {
                    match = true;
                    insertions = res.insertions;
                    matchIndexes = res.matchIndexes;
                } else {
                    matchIndexes = matchIndexes.concat(res.matchIndexes);
                }
            }
        }
    }
    if (match) {
        return ({
            value: pattern,
            insertions: insertions,
            matchIndexes: matchIndexes,
        });
    }
    return null;
};

var _score = function(entryResults) {
    var patternsMinInsertions = {};
    var patternsMinMatchIndex = {};
    entryResults.forEach(function(fieldResults) {
        fieldResults.patterns.forEach(function(pattern) {
            if (patternsMinInsertions[pattern.value] === undefined ||
                pattern.insertions < patternsMinInsertions[pattern.value]) {
                patternsMinInsertions[pattern.value] = pattern.insertions;
                patternsMinMatchIndex[pattern.value] = pattern.matchIndexes;
            }
        });
    });
    var minInsertions = 0;
    var minMatchIndex = [];
    for (var pattern in patternsMinInsertions) {
        if (patternsMinInsertions.hasOwnProperty(pattern)) {
            minInsertions += patternsMinInsertions[pattern];
            minMatchIndex = minMatchIndex.concat(patternsMinMatchIndex[pattern]);
        }
    }
    return minInsertions + minMatchIndex.sort()[0] / 1000;
};

var _getFieldString = function(entry, field) {
    var path = field;
    var current = entry;
    for (var i = 0; i < path.length; i++) {
        if (current[path[i]] === undefined) {
            return null;
        } else {
            current = current[path[i]];
        }
    }
    if (typeof current !== 'string') {
        return null;
    }
    return current;
};

var _forEachObject = function(object, fn) {
    var _locals = [];

    (function _private(object) {
        for (var key in object) {
            _locals.push(key);
            if (typeof object[key] === 'object') {
                _private(object[key]);
            } else {
                fn([].concat(_locals));
            }
            _locals.pop();
        }
    })(object);
};

var _search = function(entries, patterns, fields, options) {
    var results = [];
    entries.forEach(function(entry) {
        var match = false;
        var entryMatch = [];
        var entryResults = [];
        _forEachObject(fields, function(field) {
            var fieldString = _getFieldString(entry, field);
            if (fieldString === null) {
                return;
            }
            var fieldMatch = [];
            var fieldResults = { field: field.join('.'), patterns: [] };
            patterns.forEach(function(pattern) {
                var res = _find(pattern, fieldString, options);
                if (res) {
                    fieldResults.patterns.push(res);
                    fieldMatch.push(pattern);
                    if (entryMatch.indexOf(pattern) === -1) {
                        entryMatch.push(pattern);
                    }
                }
            });
            if (fieldMatch.length === patterns.length) {
                entryResults.push(fieldResults);
                match = true;
            } else if (options.fieldMatching === false &&
                fieldResults.patterns.length > 0) {
                entryResults.push(fieldResults);
            }
        });
        if ((options.fieldMatching === true && match === true) ||
            (options.fieldMatching === false &&
                entryMatch.length === patterns.length)) {
            results.push({
                entry: entry,
                info: entryResults,
                score: _score(entryResults)
            });
        }
    });
    return results;
};

var _buildOptions = function(options) {
    var defaultOptions = {
        caseSensitive: false,
        fieldMatching: false,
        maxInsertions: -1,
    };
    if (options === undefined) {
        return defaultOptions;
    }
    for (var option in defaultOptions) {
        if (options[option] !== undefined) {
            defaultOptions[option] = options[option];
        }
    }
    return defaultOptions;
};

var sanitizeArray = function(array, caseSensitive) {
    if (array === undefined || array.length === undefined ||
        array.length === 0) {
        return [];
    }
    var values = {};
    var newArray = [];
    array.forEach(function(elem) {
        if (typeof elem !== 'string') {
            return;
        }
        var element = !caseSensitive ? elem.toLowerCase() : elem;
        if (element && (element in values) === false) {
            values[element] = true;
            newArray.push(element);
        }
    });
    return newArray;
};

function smartSearch(entries, patterns, fields, options) {
    options = _buildOptions(options);
    patterns = sanitizeArray([].concat(patterns), options.caseSensitive);
    fields = typeof fields === 'string' ? {
        [fields]: true
    } : fields;
    if (entries.length === 0 || patterns.length === 0) {
        return;
    }
    var results = _search(entries, patterns, fields, options);
    results.sort(function(a, b) {
        return (a.score - b.score);
    });
    return results;
}


function didYouMean(str, list, key) {
    if (!str) return null;

    // If we're running a case-insensitive search, smallify str.
    if (!didYouMean.caseSensitive) { str = str.toLowerCase(); }

    // Calculate the initial value (the threshold) if present.
    var thresholdRelative = didYouMean.threshold === null ? null : didYouMean.threshold * str.length,
        thresholdAbsolute = didYouMean.thresholdAbsolute,
        winningVal;
    if (thresholdRelative !== null && thresholdAbsolute !== null) winningVal = Math.min(thresholdRelative, thresholdAbsolute);
    else if (thresholdRelative !== null) winningVal = thresholdRelative;
    else if (thresholdAbsolute !== null) winningVal = thresholdAbsolute;
    else winningVal = null;

    // Get the edit distance to each option. If the closest one is less than 40% (by default) of str's length,
    // then return it.
    var winner, candidate, testCandidate, val,
        i, len = list.length;
    for (i = 0; i < len; i++) {
        // Get item.
        candidate = list[i];
        // If there's a key, get the candidate value out of the object.
        if (key) { candidate = candidate[key]; }
        // Gatekeep.
        if (!candidate) { continue; }
        // If we're running a case-insensitive search, smallify the candidate.
        if (!didYouMean.caseSensitive) { testCandidate = candidate.toLowerCase(); } else { testCandidate = candidate; }
        // Get and compare edit distance.
        val = getEditDistance(str, testCandidate, winningVal);
        // If this value is smaller than our current winning value, OR if we have no winning val yet (i.e. the
        // threshold option is set to null, meaning the caller wants a match back no matter how bad it is), then
        // this is our new winner.
        if (winningVal === null || val < winningVal) {
            winningVal = val;
            // Set the winner to either the value or its object, depending on the returnWinningObject option.
            if (key && didYouMean.returnWinningObject) winner = list[i];
            else winner = candidate;
            // If we're returning the first match, return it now.
            if (didYouMean.returnFirstMatch) return winner;
        }
    }

    // If we have a winner, return it.
    return winner || didYouMean.nullResultValue;
}

// Set default options.
didYouMean.threshold = 0.4;
didYouMean.thresholdAbsolute = 20;
didYouMean.caseSensitive = false;
didYouMean.nullResultValue = null;
didYouMean.returnWinningObject = null;
didYouMean.returnFirstMatch = false;

// Expose.
// In node...
if (typeof module !== 'undefined' && module.exports) {
    module.exports = didYouMean;
}
// Otherwise...
else {
    window.didYouMean = didYouMean;
}

var MAX_INT = Math.pow(2, 32) - 1; // We could probably go higher than this, but for practical reasons let's not.
function getEditDistance(a, b, max) {
    // Handle null or undefined max.
    max = max || max === 0 ? max : MAX_INT;

    var lena = a.length;
    var lenb = b.length;

    // Fast path - no A or B.
    if (lena === 0) return Math.min(max + 1, lenb);
    if (lenb === 0) return Math.min(max + 1, lena);

    // Fast path - length diff larger than max.
    if (Math.abs(lena - lenb) > max) return max + 1;

    // Slow path.
    var matrix = [],
        i, j, colMin, minJ, maxJ;

    // Set up the first row ([0, 1, 2, 3, etc]).
    for (i = 0; i <= lenb; i++) { matrix[i] = [i]; }

    // Set up the first column (same).
    for (j = 0; j <= lena; j++) { matrix[0][j] = j; }

    // Loop over the rest of the columns.
    for (i = 1; i <= lenb; i++) {
        colMin = MAX_INT;
        minJ = 1;
        if (i > max) minJ = i - max;
        maxJ = lenb + 1;
        if (maxJ > max + i) maxJ = max + i;
        // Loop over the rest of the rows.
        for (j = 1; j <= lena; j++) {
            // If j is out of bounds, just put a large value in the slot.
            if (j < minJ || j > maxJ) {
                matrix[i][j] = max + 1;
            }

            // Otherwise do the normal Levenshtein thing.
            else {
                // If the characters are the same, there's no change in edit distance.
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                // Otherwise, see if we're substituting, inserting or deleting.
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // Substitute
                        Math.min(matrix[i][j - 1] + 1, // Insert
                            matrix[i - 1][j] + 1)); // Delete
                }
            }

            // Either way, update colMin.
            if (matrix[i][j] < colMin) colMin = matrix[i][j];
        }

        // If this column's minimum is greater than the allowed maximum, there's no point
        // in going on with life.
        if (colMin > max) return max + 1;
    }
    // If we made it this far without running into the max, then return the final matrix value.
    return matrix[lenb][lena];
}

// if (typeof exports !== 'undefined') {
//     if (typeof module !== 'undefined' && module.exports) {
//         exports = module.exports = smartSearch;
//     }
//     exports.smartSearch = smartSearch;
// } else if (angular) {
//     angular
//         .module('ngSmartSearch', [])
//         .filter('smartSearch', function() {
//             return smartSearch;
//         });
// } else {
//     window.smartSearch = smartSearch;
// }



const data4 = [{

        // ____________________________________Холодильные шкафы стеклянные однодверные___________________________________________
        link: "dm105s.html",
        title: "Холодильный шкаф Polair DM105-S",
        desc: "Холодильный шкаф Polair DM105-S – идеальное решение для продажи напитков и продуктов. Современный и надежный шкаф оснащен профессиональной динамической холодильной системой, имеет цельнозаливной пенополиуретаном корпус из стали с полимерным покрытием (снаружи и изнутри).",
        img: "/themes/images/products/shkaf/polair/main/9.jpg",
        price: 349650,
        code: "1517"
    }, {
        link: "dm107s.html",
        title: "Холодильный шкаф Polair DM107-S без канапе",
        desc: "Холодильный шкаф DM107-S – вместительный и функциональный, позволяет хранить и экспонировать значительные объемы продуктов и напитков. Подходит для предприятий общественного питания и магазинов всех форматов и форм торговли. Вертикальная подсветка равномерно освещает товар на всех полках шкафа.",
        img: "/themes/images/products/shkaf/polair/mal/10.png",
        price: 425130,
        code: "1518"
    }, {
        link: "dp102s.html",
        title: "Холодильный шкаф Polair DP102-S",
        desc: "Шкаф разработан в соответствии с требованиями самых взыскательных покупателей к высокому качеству демонстрации и продажи икры и пресервов, надежному хранению этих деликатесных продуктов, оптимизации торговых площадей и работы персонала, элегантному и современному дизайну оборудования, способному органично вписаться в любой интерьер.",
        img: "/themes/images/products/shkaf/polair/main/16.jpg",
        price: 320235,
        code: "1522"
    }, {
        link: "dm102_bravo.html",
        title: "Холодильный шкаф Polair DM102-Bravo",
        desc: "Холодильный шкаф Polair DM102-Bravo с замком предназначен для демонстрации и продажи продуктов и напитков.",
        img: "/themes/images/products/shkaf/polair/main/17.jpg",
        price: 298035,
        code: "1523"
    }, {
        link: "dm104_bravo.html",
        title: "Холодильный шкаф Polair DM104-Bravo",
        desc: "POLAIR Bravo – компактные и вместительные холодильные шкафы объемом до 400 л. Цельнозаливной корпус, динамическая система охлаждения, увеличенная нагрузка на полку - до 50 кг, подсветка выкладки и канапе светодиодными лампами.",
        img: "/themes/images/products/shkaf/polair/main/19.jpg",
        price: 344100,
        code: "1524"
    }, {
        link: "bc105.html",
        title: "Холодильный шкаф Polair BC105",
        desc: "Холодильный шкаф Polair со стеклянными дверьми Polair BC105 предназначен для охлаждения, хранения, демонстрации и продажи практически любого вида товара. Данный шкаф изготовлен из цельнозаливного корпуса, а так же имеет небольшой воздухоохладитель и обладает высокой эффективностью и пониженным шумом.",
        img: "/themes/images/products/shkaf/polair/main/20.jpg",
        price: 167960,
        code: "1525"
    }, {
        link: "shx.html",
        title: "Холодильный шкаф ШХ",
        desc: "Холодильный шкаф ШХ специально разработан для демонстрации и продажи икры, рыбных деликатесов и пресервов с учетом всех требований к условиям хранения и экспозиции этих деликатесных продуктов с температурой хранения от -6°С до 6°С.",
        img: "/themes/images/products/shkaf/main/1.jpg",
        price: 325008,
        code: "1502"
    }, {
        link: "bonvini.html",
        title: "Холодильный шкаф Bonvini",
        desc: "Bonvini - профессиональные холодильные шкафы, современная светодиодная подсветка, имеющая компактные размеры, своим белым холодным цветом свечения, придает особый, привлекательный вид охлаждаемому продукту.",
        img: "/themes/images/products/shkaf/main/201.jpg",
        price: 429000,
        code: "1515"
    }, {
        link: "capri390.html",
        title: "Холодильный шкаф Capri П-390С",
        desc: "Шкаф холодильный Capri П-390С среднетемпературный предназначен для кратковременного хранения, демонстрации и продажи, предварительно охлаждённых до температуры охлаждаемого объёма, пищевых продуктов и напитков.",
        img: "/themes/images/products/shkaf/main/2.jpg",
        price: 309393,
        code: "1503"
    }, {
        link: "capri490.html",
        title: "Холодильный шкаф Capri П-490СК",
        desc: "Шкаф холодильный Capri П-490СК среднетемпературный предназначен для кратковременного хранения, демонстрации и продажи, предварительно охлаждённых до температуры охлаждаемого объёма, пищевых продуктов и напитков.",
        img: "/themes/images/products/shkaf/main/3.jpg",
        price: 325091,
        code: "1504"
    }, {
        link: "carboma_shkaf.html",
        title: "Холодильный шкаф Carboma ULTRA",
        desc: "Холодильный шкаф Carboma ULTRA - это современный элегантный дизайн Вашего магазина, бара, ресторана, высокая надежность,значительная экономия в потреблении электроэнергии.",
        img: "/themes/images/products/shkaf/main/1.png",
        price: 391870,
        code: "1512"
    }, {
        link: "carboma_shkaf2.html",
        title: "Холодильный шкаф Carboma Premium",
        desc: "Холодильный шкаф Carboma Premium предназначен для демонстрации напитков, кондитерских изделий и десертов в магазинах, кафе, ресторанах.",
        img: "/themes/images/products/shkaf/main/3.png",
        price: 422330,
        code: "1513"
    }, {
        link: "capri05.html",
        title: "Холодильный шкаф Capri 0,5СК",
        desc: "Холодильные шкафы Капри 0,5СК бывают двух размеров. Данные шкафы предназначены для кратковременного хранения, демонстрации и продажи, предварительно охлажденных до температуры охлаждаемого объема, пищевых продуктов и напитков.",
        img: "/themes/images/products/shkaf/main/4.jpg",
        price: 340805,
        code: "1505"
    },

    // _________________________________Холодильные шкафы стеклянные двухдверные________________________________________________________

    {
        link: "dm110s.html",
        title: "Холодильный шкаф Polair DM110-S без канапе",
        desc: "Компактный и вместительный шкаф с распашными дверьми в алюминиевых рамах с легко заменяемыми стеклопакетами, съемным уплотнителем с магнитной вставкой, механизмом самозакрывания.",
        img: "/themes/images/products/shkaf/polair/main/12.png",
        price: 563325,
        code: "1519"
    }, {
        link: "dm110sd.html",
        title: "Холодильный шкаф Polair DM110Sd-S",
        desc: "Холодильный шкаф Polair DM110Sd-S с раздвижными дверьми – купе – отличное решение для продажи напитков и продуктов на предприятиях торговли и общественного питания любых форматов и любой площади.",
        img: "/themes/images/products/shkaf/polair/main/14.jpg",
        price: 569430,
        code: "1520"
    }, {
        link: "dv110s.html",
        title: "Холодильный шкаф Polair DV110-S",
        desc: "Холодильный шкаф Polair с универсальным температурным режимом подойдет для хранения и продажи широкого ассортимента охлажденных продуктов и пресервов.",
        img: "/themes/images/products/shkaf/polair/main/15.jpg",
        price: 628260,
        code: "1521"
    }, {
        link: "bc110sd.html",
        title: "Холодильный шкаф Polair BC110Sd",
        desc: "Холодильный шкаф Polair со стеклянными дверьми Polair BC110Sd предназначен для охлаждения, хранения, демонстрации и продажи практически любого вида товара. Данный шкаф изготовлен из цельнозаливного корпуса.",
        img: "/themes/images/products/shkaf/polair/main/21.jpg",
        price: 237960,
        code: "1526"
    }, {
        link: "shx08.html",
        title: "Холодильный шкаф ШХ 0,80C Купе",
        desc: "Холодильный шкаф ШХ 0,80С Купе бывает двух видов - со статическим охлаждением и с динамическим охлаждением. Данные шкафы предназначены для хранения, демонстрации и продажи пищевых продуктов и напитков в предприятиях торговли: магазинах различных форматов, рынках, павильонах.",
        img: "/themes/images/products/shkaf/main/5.jpg",
        price: 448490,
        code: "1506"
    }, {
        link: "shx080.html",
        title: "Холодильный шкаф ШХ 0,80C",
        desc: "Холодильный шкаф ШХ 0,80С предназначен для хранения, демонстрации и продажи пищевых продуктов и напитков в предприятиях торговли: магазинах различных форматов, рынках, павильонах. В холодильном шкафу ШХ используется динамическое охлаждение.",
        img: "/themes/images/products/shkaf/main/6.jpg",
        price: 487205,
        code: "1507"
    }, {
        link: "elton07.html",
        title: "Холодильный шкаф Elton 0,7 купе",
        desc: "Холодильный шкаф Elton 0,7 купе — используется во всех форматах продовольственных магазинов, барах, ресторанах, кафе, столовых.",
        img: "/themes/images/products/shkaf/main/7.jpg",
        price: 271585,
        code: "1508"
    }, {
        link: "capri112.html",
        title: "Холодильный шкаф Capri 1,12СК Купе",
        desc: "Холодильные шкафы Capri 1,12СК Купе бывают двух видов - со статическим охлаждением и с динамическим охлаждением.",
        img: "/themes/images/products/shkaf/main/8.jpg",
        price: 571027,
        code: "1509"
    }, {
        link: "capri15.html",
        title: "Холодильный шкаф Capri 1,5СК Купе",
        desc: "Холодильный шкаф Capri 1,5СК Купе бывает двух видов - со статическим охлаждением и с динамическим охлаждением. Данные шкафы используются во всех форматах продовольственных магазинов, барах, ресторанах, кафе, столовых.",
        img: "/themes/images/products/shkaf/main/9.jpg",
        price: 619616,
        code: "1510"
    }, {
        link: "elton15.html",
        title: "Холодильный шкаф Elton 1,5С Купе",
        desc: "Холодильный шкаф Elton 1,5С Купе используется во всех форматах продовольственных магазинов, барах, ресторанах, кафе, столовых.Холодильный шкаф является универсальным видом оборудования.",
        img: "/themes/images/products/shkaf/main/10.jpg",
        price: 437190,
        code: "1511"
    },
    // ________________________________Холодильные шкафы с глухими дверьми_____________________________________________________
    {
        link: "cm105s.html",
        title: "Холодильный шкаф CM105-S",
        desc: "Практичный и надежный, компактный и вместительный, создан для применения на предприятиях торговли и общественного питания. Удобен для хранения упакованных молочных, гастрономических продуктов, кулинарии, кондитерских изделий, фруктов и овощей и т.п.",
        img: "/themes/images/products/shkaf/polair/main/1.jpg",
        price: 344655,
        code: "1525"
    }, {
        link: "cm110s.html",
        title: "Холодильный шкаф CM110-S",
        desc: "Надежный и вместительный шкаф удобен для использования в помещениях различных назначений и размеров предприятий торговли и общепита. Благодаря продуманной конструкции корпуса легко пройдет в дверной проем любой ширины. СМ110-S предназначен для хранения охлажденных гастрономических изделий, молочных продуктов, полуфабрикатов различной степени готовности, кондитерских изделий и т.п.",
        img: "/themes/images/products/shkaf/polair/main/2.jpg",
        price: 512265,
        code: "1526"
    }, {
        link: "cm105sm.html",
        title: "Холодильный шкаф CM105-Sm",
        desc: "Практичный и надежный, компактный и вместительный, создан для применения на предприятиях торговли и общественного питания. Удобен для хранения упакованных молочных, гастрономических продуктов, кулинарии, кондитерских изделий, фруктов и овощей и т.п.",
        img: "/themes/images/products/shkaf/polair/main/3.jpg",
        price: 391275,
        code: "1527"
    }, {
        link: "cm110sm.html",
        title: "Холодильный шкаф CM110-Sm",
        desc: "Надежный и вместительный шкаф удобен для использования в помещениях различных назначений и размеров предприятий торговли и общепита. Благодаря продуманной конструкции корпуса легко пройдет в дверной проем любой ширины. СМ110-Sm предназначен для хранения охлажденных гастрономических изделий, молочных продуктов, полуфабрикатов различной степени готовности, кондитерских изделий и т.п.",
        img: "/themes/images/products/shkaf/polair/main/4.jpg",
        price: 572205,
        code: "1528"
    }, {
        link: "cm105g.html",
        title: "Холодильный шкаф CM105-G",
        desc: "Холодильный шкаф POLAIR CM105-G серии Grande предназначен для демонстрации и хранения продуктов на предприятиях общественного питания и торговли. Корпус изготовлен из нержавеющей стали снаружи и изнутри (кроме задней стенки) и обеспечивает механическую прочность и долговечность шкафа.",
        img: "/themes/images/products/shkaf/polair/main/5.jpg",
        price: 523365,
        code: "1529"
    }, {
        link: "cm110g.html",
        title: "Холодильный шкаф CM110-G",
        desc: "Холодильный шкаф POLAIR CM110-G серии Grande предназначен для демонстрации и хранения продуктов на предприятиях общественного питания и торговли. Корпус изготовлен из нержавеющей стали снаружи и изнутри (кроме задней стенки) и обеспечивает механическую прочность и долговечность шкафа.",
        img: "/themes/images/products/shkaf/polair/main/6.jpg",
        price: 733710,
        code: "1530"
    }, {
        link: "cm105gm.html",
        title: "Холодильный шкаф CM105-Gm",
        desc: "Холодильный шкаф POLAIR CM105-Gm серии Grande modificato предназначен для демонстрации и хранения продуктов на предприятиях общественного питания и торговли. Цельнозаливной корпус изготовлен из нержавеющей стали снаружи и изнутри (кроме задней стенки) и обеспечивает механическую прочность и долговечность шкафа.",
        img: "/themes/images/products/shkaf/polair/main/7.jpg",
        price: 523365,
        code: "1531"
    }, {
        link: "cm110gm.html",
        title: "Холодильный шкаф CM110-Gm",
        desc: "Холодильный шкаф POLAIR CM110-Gm серии Grande modificato предназначен для демонстрации и хранения продуктов на предприятиях общественного питания и торговли. Цельнозаливной корпус изготовлен из нержавеющей стали снаружи и изнутри (кроме задней стенки) и обеспечивает механическую прочность и долговечность шкафа. Оборудование рассчитано на работу при температуре окружающей среды до 40 °С и относительной влажности воздуха до 80%.",
        img: "/themes/images/products/shkaf/polair/main/8.jpg",
        price: 733710,
        code: "1532"
    }, {
        link: "carboma_met.html",
        title: "Холодильный шкаф с металлическими дверьми Carboma",
        desc: "Холодильные шкафы с металлическими дверьми Carboma - надежные в эксплуатации, многофункциональные шкафы, предназначенные для хранения и продажи охлажденных или замороженных пищевых продуктов и напитков на предприятиях торговли и общественного питания.",
        img: "/themes/images/products/shkaf/main/2.png",
        price: 523365,
        code: "1516"
    }, {
        link: "kapri_nerjaveika.html",
        title: "Холодильный шкаф Capri нержавейка",
        desc: "Холодильные шкафы Капри нержавейка бывают двух размеров. Данные шкафы предназначены для кратковременного хранения, демонстрации и продажи, предварительно охлажденных до температуры охлаждаемого объема, пищевых продуктов и напитков.",
        img: "/themes/images/products/shkaf/main/30.jpg",
        price: 678364,
        code: "1514"
    },
    // ____________________________________Фармацевтические холодильные шкафы________________________________________________
    {
        link: "shxf02.html",
        title: "Холодильный шкаф ШХФ-0,2",
        desc: "Холодильный шкаф ШХФ-0,2 предназначен для хранения лекарственных, биологических, ветеринарных препаратов в аптеках, медицинских, больничных и научно-исследовательских учреждениях, диагностических центрах и на предприятиях фармацевтической отрасли.",
        img: "/themes/images/products/shkaf/pharmacy/main/1.jpg",
        price: 325008,
        code: "1533"
    }, {
        link: "shxf04.html",
        title: "Холодильный шкаф ШХФ-0,4",
        desc: "Холодильный шкаф ШХФ-0,4 серии Medico предназначен для хранения лекарственных, биологических, ветеринарных препаратов в аптеках, медицинских, больничных и научно-исследовательских учреждениях, диагностических центрах и на предприятиях фармацевтической отрасли.",
        img: "/themes/images/products/shkaf/pharmacy/main/2.jpg",
        price: 393606,
        code: "1534"
    }, {
        link: "shxf05.html",
        title: "Холодильный шкаф ШХФ-0,5",
        desc: "Компактный и вместительный холодильный шкаф с динамической системой охлаждения, оснащен микропереключателем, светодиодной подсветкой, имеет механизм самозакрывания дверей, сторону открывания которых легко изменить. Предназначен для использования в качестве «холодного» и «прохладного» шкафов для хранения лекарственных средств.",
        img: "/themes/images/products/shkaf/polair/main/1.jpg",
        price: 374958,
        code: "1535"
    }, {
        link: "shxf1.html",
        title: "Холодильный шкаф ШХФ-1",
        desc: "Вместительный двухдверный холодильный шкаф объемом 1000 л, благодаря компактным размерам, легко пройдет в стандартный дверной проем. Электронный блок управления имеет настройки, позволяющие устанавливать нужную температуру в диапазоне от +1 до +15°С. Микропереключатель отключает вращение вентилятора воздухоохладителя и включает внутреннюю подсветку.",
        img: "/themes/images/products/shkaf/polair/main/2.jpg",
        price: 525474,
        code: "1536"
    }, {
        link: "shxf02_dc.html",
        title: "Холодильный шкаф ШХФ-0,2 ДС",
        desc: "Холодильный шкаф ШХФ-0,2 ДС серии Medico предназначен для хранения лекарственных, биологических, ветеринарных препаратов в аптеках, медицинских, больничных и научно-исследовательских учреждениях, диагностических центрах и на предприятиях фармацевтической отрасли.",
        img: "/themes/images/products/shkaf/pharmacy/main/5.jpg",
        price: 333666,
        code: "1537"
    }, {
        link: "shxf04_dc.html",
        title: "Холодильный шкаф ШХФ-0,4 ДС",
        desc: "Холодильный шкаф ШХФ-0,4 ДС предназначен для хранения лекарственных, биологических, ветеринарных препаратов в аптеках, медицинских, больничных и научно-исследовательских учреждениях, диагностических центрах и на предприятиях фармацевтической отрасли.",
        img: "/themes/images/products/shkaf/pharmacy/main/6.jpg",
        price: 398934,
        code: "1538"
    }, {
        link: "shxf05_dc.html",
        title: "Холодильный шкаф ШХФ-0,5 ДС",
        desc: "Холодильный шкаф со стеклянной дверью (стеклопакет в разборной алюминиевой раме) имеет вертикальную внутреннюю подсветку и подсветку канапе. Сторону открывания двери легко изменить. Внешние и внутренние обшивки шкафа изготовлены из стали с полимерным покрытием.",
        img: "/themes/images/products/shkaf/polair/main/9.jpg",
        price: 376956,
        code: "1539"
    }, {
        link: "shxf1_dc.html",
        title: "Холодильный шкаф ШХФ-1,0 ДС",
        desc: "Холодильный шкаф объемом 1000 л с распашными стеклянными дверьми обеспечивает хранение существенного объема лекарственных средств, гарантируя их эффективное и равномерное охлаждение на всех полках шкафа. Динамическая система охлаждения, цельнозаливной корпус с обшивками из стали с полимерным покрытием – снаружи и изнутри, вертикальная внутренняя подсветка и подсветка канапе делают шкаф незаменимым для фармацевтических и медицинских учреждений.",
        img: "/themes/images/products/shkaf/polair/main/15.jpg",
        price: 604728,
        code: "1540"
    },
    // ________________________________Холодильные витрины_______________________________________________
    {
        wlink: "gc95.html",
        title: "Холодильная витрина GC95",
        desc: "Серия напольных холодильных витрин CARBOMA GC95 это: - лаконичные формы с одной целью: максимальный акцент на продукты; - только энергосберегающие технологии (низкоэмиссионное стекло, LED-освещение в базовой комплектации)",
        img: "/themes/images/products/vitrina/polus/list/77.jpg",
        price: 329794,
        code: "1617"
    }, {
        link: "gc110.html",
        title: "Холодильная витрина GC110",
        desc: "Серия напольных холодильных витрин CARBOMA GC110 это: - лаконичные формы с одной целью: максимальный акцент на продукты; - конфигурация любой формы и соединение в линии; - только энергосберегающие технологии (низкоэмиссионное стекло, LED-освещение в базовой комплектации)",
        img: "/themes/images/products/vitrina/polus/list/8.jpg",
        price: 349700,
        code: "1639"
    }, {
        link: "carboma_close.html",
        title: "Холодильная витрина Carboma закрытая",
        desc: "Холодильная витрина Carboma закрытая отличаются современным дизайном, оптимальными эргономическими показателями, эффективным уровнем энергопотребления и холодопроизводительности.",
        img: "/themes/images/products/vitrina/polus/list/9.png",
        price: 378214,
        code: "1618"
    }, {
        link: "carboma_open.html",
        title: "Холодильная витрина Carboma открытая",
        desc: "Холодильная витрина Carboma открытая отличаются современным дизайном, оптимальными эргономическими показателями, эффективным уровнем энергопотребления и холодопроизводительности.",
        img: "/themes/images/products/vitrina/polus/main/99.jpg",
        price: 453534,
        code: "1619"
    }, {
        link: "vitrina_polus.html",
        title: "Холодильная витрина Полюс",
        desc: "Холодильная витрина Полюс отличаются современным дизайном, оптимальными эргономическими показателями, эффективным уровнем энергопотребления и холодопроизводительности.",
        img: "/themes/images/products/vitrina/polus/list/10.png",
        price: 319572,
        code: "1620"
    }, {
        link: "vitrina_eko_maxi.html",
        title: "Холодильная витрина Эко Maxi",
        desc: "Холодильная витрина Эко Maxi отличаются современным дизайном, оптимальными эргономическими показателями, эффективным уровнем энергопотребления и холодопроизводительности.",
        img: "/themes/images/products/vitrina/polus/list/20.jpg",
        price: 149093,
        code: "1621"
    }, {
        link: "vitrina_eko_mini.html",
        title: "Холодильная витрина Эко Mini",
        desc: "Холодильная витрина Эко Mini отличаются современным дизайном, оптимальными эргономическими показателями, эффективным уровнем энергопотребления и холодопроизводительности.",
        img: "/themes/images/products/vitrina/polus/list/30.jpg",
        price: 92093,
        code: "1622"
    }, {
        link: "ilet_bhx.html",
        title: "Холодильная витрина ILET BXH",
        desc: "Холодильная витрина ILET BXH предназначены для презентации и продажи мяса, птицы, колбасно-молочных и гастрономических изделия в магазинах с небольшими торговыми площадями и узкими дверными проемами.",
        img: "/themes/images/products/vitrina/mxm/list/5.jpg",
        price: 482680,
        code: "1623"
    }, {
        link: "ilet_bhc.html",
        title: "Холодильная витрина ILET BXC",
        desc: "Холодильная витрина ILET BXC для продовольственных магазинов любого формата, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, Carel или Danfoss, пенополиуретан BASF, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/6.jpg",
        price: 380260,
        code: "1624"
    }, {
        link: "nova_bxh.html",
        title: "Холодильная витрина Nova ВХН",
        desc: "Холодильная витрина Nova ВХН эконом-класса для магазинов небольшой и средней площади, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, Carel или Danfoss, электродвигатели EBM PAPST, пенополиуретан BASF, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/7.jpg",
        price: 335116,
        code: "1625"
    }, {
        link: "tair_bxh.html",
        title: "Холодильная витрина Tair ВХН",
        desc: "Холодильная витрина Tair ВХН для магазинов небольшой и средней площади, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, Carel или Danfoss, электродвигатели EBM PAPST, пенополиуретан BASF, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/main/8.jpg",
        price: 389060,
        code: "1626"
    }, {
        link: "ilet_bxcd.html",
        title: "Холодильная витрина ILET BXCD",
        desc: "Холодильная витрина ILET BXCD для магазинов небольшой и средней площади, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, Carel или Danfoss, электродвигатели EBM PAPST, пенополиуретан BASF, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/9.jpg",
        price: 462837,
        code: "1627"
    }, {
        link: "ilet_bxch.html",
        title: "Холодильная витрина ILET BXCH",
        desc: "Холодильная витрина ILET BXCH для продовольственных магазинов любого формата, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, Carel или Danfoss, пенополиуретан BASF, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/10.jpg",
        price: 212990,
        code: "1628"
    }, {
        link: "ilet_bxcho.html",
        title: "Холодильная витрина ILET BXCO",
        desc: "Холодильная витрина ILET BXCO для продовольственных магазинов любого формата, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, Carel или Danfoss, пенополиуретан BASF, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/1000.jpg",
        price: 368181,
        code: "1629"
    }, {
        link: "bxc_ub.html",
        title: "Холодильная витрина ВХС-УВ Илеть",
        desc: "Холодильная витрина ВХС-УВ: угол внутренний ВХС-УВ Илеть и угол наружный ВХС-УН Илеть (внутренний и наружный угловые модули 90°), предназначены для хранения, демонстрации и продажи предварительно охлаждённых пищевых продуктов в продовольственных магазинах любого формата, кафе, других предприятиях общественного питания..",
        img: "/themes/images/products/vitrina/mxm/list/11.jpg",
        price: 592920,
        code: "1630"
    }, {
        link: "bxc_uh.html",
        title: "Холодильная витрина ВХС-УН Илеть",
        desc: "Холодильная витрина ВХС-УН: угол внутренний ВХС-УВ Илеть и угол наружный ВХС-УН Илеть (внутренний и наружный угловые модули 90°), предназначены для хранения, демонстрации и продажи предварительно охлаждённых пищевых продуктов в продовольственных магазинах любого формата, кафе, других предприятиях общественного питания.",
        img: "/themes/images/products/vitrina/mxm/list/13.jpg",
        price: 564675,
        code: "1631"
    }, {
        link: "bxco_uh.html",
        title: "Холодильная витрина ВХСo-УН Илеть",
        desc: "Холодильная витрина ВХСo-УH для продовольственных магазинов любого формата, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss, контроллер Evco, Carel или Danfoss, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/12.jpg",
        price: 531405,
        code: "1632"
    }, {
        link: "tair_bxc_uh.html",
        title: "Холодильная витрина Tair ВХС-УН",
        desc: "Холодильная витрина Tair ВХС-УН (наружный и внутренний угловые модули 90°), обслуживаемые продавцом, предназначены для демонстрации и продажи предварительно охлаждённых пищевых продуктов и позволяют составлять из витрин марки Таир линии специальной конфигурации с поворотами.",
        img: "/themes/images/products/vitrina/mxm/list/14.jpg",
        price: 569655,
        code: "1633"
    }, {
        link: "tair_bxc_ub.html",
        title: "Холодильная витрина Tair ВХС-УВ",
        desc: "Холодильная витрина Tair ВХС-УВ (наружный и внутренний угловые модули 90°), обслуживаемые продавцом, предназначены для демонстрации и продажи предварительно охлаждённых пищевых продуктов и позволяют составлять из витрин марки Таир линии специальной конфигурации с поворотами.",
        img: "/themes/images/products/vitrina/mxm/list/15.jpg",
        price: 573441,
        code: "1634"
    }, {
        link: "parabel_bxc.html",
        title: "Холодильная витрина Parabel ВХС",
        desc: "Холодильная витрина Parabel ВХС c механизмом подъема стекла для магазинов небольшой и средней площади, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/16.jpg",
        price: 347870,
        code: "1635"
    }, {
        link: "parabel_bxc_ub.html",
        title: "Холодильная витрина Parabel ВХС-УВ",
        desc: "Холодильная витрина Parabel ВХС-УВ c механизмом подъема стекла для магазинов небольшой и средней площади, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/17.jpg",
        price: 737014,
        code: "1636"
    }, {
        link: "parabel_bxc_uh.html",
        title: "Холодильная витрина Parabel ВХС-УН",
        desc: "Холодильная витрина Parabel ВХС-УН c механизмом подъема стекла для магазинов небольшой и средней площади, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/18.jpg",
        price: 719778,
        code: "1637"
    }, {
        link: "parabel_bxco.html",
        title: "Холодильная витрина Parabel ВХСo",
        desc: "Холодильная витрина Parabel ВХСo c механизмом подъема стекла для магазинов небольшой и средней площади, для продажи гастрономии, молочных продуктов, пресервов, кондитерских и замороженных продуктов. Используются импортные комплектущие: компрессор Danfoss или Tecumseh, контроллер Evco, пищевая нержавеющая сталь.",
        img: "/themes/images/products/vitrina/mxm/list/19.jpg",
        price: 299344,
        code: "1638"
    }, {
        link: "cryspi_octava_SN_1200.html",
        title: "Холодильная витрина CRYSPI Octava SN 1200",
        desc: "Холодильная витрина Cryspi Octava SN 1200 предназначена для демонстрации, охлаждения и кратковременного хранения скоропортящихся продуктов на предприятиях торговли и общественного питания. Модель оснащена изогнутым фронтальным стеклом, люминесцентной подсветкой и вместительной охлаждаемой камерой для хранения запаса товара. Экспозиционная и рабочая поверхности выполнены из нержавеющей стали, боковые панели - из ударопрочного ABS-пластика, теплоизоляция - из пенополиуретана.",
        img: "/themes/images/products/vitrina/octava/CRYSPI_Octava_SN_1200.jpg",
        price: 406537,
        code: "1640"
    }, {
        link: "cryspi_octava_SN_1500.html",
        title: "Холодильная витрина CRYSPI Octava SN 1500",
        desc: "Холодильная витрина Cryspi Octava SN 1500 предназначена для демонстрации, охлаждения и кратковременного хранения скоропортящихся продуктов на предприятиях торговли и общественного питания. Модель оснащена изогнутым фронтальным стеклом, люминесцентной подсветкой и вместительной охлаждаемой камерой для хранения запаса товара. Экспозиционная и рабочая поверхности выполнены из нержавеющей стали, боковые панели - из ударопрочного ABS-пластика, теплоизоляция - из пенополиуретана.",
        img: "/themes/images/products/vitrina/octava/CRYSPI_Octava_SN_1500.jpg",
        price: 458393,
        code: "1641"
    }, {
        link: "cryspi_octava_SN_1800.html",
        title: "Холодильная витрина CRYSPI Octava SN 1800",
        desc: "Холодильная витрина Cryspi Octava SN 1800 предназначена для демонстрации, охлаждения и кратковременного хранения скоропортящихся продуктов на предприятиях торговли и общественного питания. Модель оснащена изогнутым фронтальным стеклом, люминесцентной подсветкой и вместительной охлаждаемой камерой для хранения запаса товара. Экспозиционная и рабочая поверхности выполнены из нержавеющей стали, боковые панели - из ударопрочного ABS-пластика, теплоизоляция - из пенополиуретана.",
        img: "/themes/images/products/vitrina/octava/CRYSPI_Octava_SN_1800.jpg",
        price: 509102,
        code: "1642"
    }, {
        link: "kp_gamma_1200.html",
        title: "Холодильная витрина CRYSPI Gamma2 SN 1200",
        desc: "Витрина универсальная CRYSPI Gamma-2 SN 1200 — современное холодильное оборудование с автоматической разморозкой и встроенным холодильным агрегатом. Работает с системой гравитационного охлаждения. В качестве хладагента выбран экологически безопасный R404А.",
        img: "/themes/images/products/vitrina/gamma/CRYSPI_Gamma2_SN_1200.jpg",
        price: 468054,
        code: "1643"
    }, {
        link: "kp_gamma_1500.html",
        title: "Холодильная витрина CRYSPI Gamma2 SN 1500",
        desc: "Витрина универсальная CRYSPI Gamma-2 SN 1500 — современное холодильное оборудование с автоматической разморозкой и встроенным холодильным агрегатом. Работает с системой гравитационного охлаждения. В качестве хладагента выбран экологически безопасный R404А.",
        img: "/themes/images/products/vitrina/gamma/CRYSPI_Gamma2_SN_1500.jpg",
        price: 524084,
        code: "1644"
    }, {
        link: "kp_gamma_1800.html",
        title: "Холодильная витрина CRYSPI Gamma2 SN 1800",
        desc: "Витрина универсальная CRYSPI Gamma-2 SN 1800 — современное холодильное оборудование с автоматической разморозкой и встроенным холодильным агрегатом. Работает с системой гравитационного охлаждения. В качестве хладагента выбран экологически безопасный R404А.",
        img: "/themes/images/products/vitrina/gamma/CRYSPI_Gamma2_SN_1800.jpg",
        price: 597085,
        code: "1645"
    },
    // _______________
    {
        link: "italfrigo_toscana_wl.html",
        title: "Italfrigo Toscana WL",
        desc: "Витрина открытого типа Italfrigo Toscana WL (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_wl_1.jpg",
        price: 844731,
        code: "1700"
    },
    // {
    //     link: "italfrigo_toscana_wl_1875.html",
    //     title: "Italfrigo Toscana WL ВПС 1875 Д",
    //     desc: "Витрина открытого типа Italfrigo Toscana WL ВПС 1875 Д (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
    //     img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_wl_1.jpg",
    //     price: 1113023,
    //     code: "1701"
    // }, {
    //     link: "italfrigo_toscana_wl_2500.html",
    //     title: "Italfrigo Toscana WL ВПС 2500 Д",
    //     desc: "Витрина открытого типа Italfrigo Toscana WL ВПС 2500 Д (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
    //     img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_wl_1.jpg",
    //     price: 1336411,
    //     code: "1702"
    // }, {
    //     link: "italfrigo_toscana_wl_3750.html",
    //     title: "Italfrigo Toscana WL ВПС 3750 Д",
    //     desc: "Витрина открытого типа Italfrigo Toscana WL ВПС 3750 Д (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
    //     img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_wl_1.jpg",
    //     price: 1795733,
    //     code: "1703"
    // }, 
    {
        link: "italfrigo_toscana_wl_self.html",
        title: "Italfrigo Toscana WL Self",
        desc: "Витрина открытого типа Italfrigo Toscana WL Self (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_wl_self_1.jpg",
        price: 824792,
        code: "1704"
    },
    // {
    //     link: "italfrigo_toscana_wl_self_1875.html",
    //     title: "Italfrigo Toscana WL Self ВПС 1875 Д",
    //     desc: "Витрина открытого типа Italfrigo Toscana WL Self ВПС 1875 Д (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
    //     img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_wl_self_1.jpg",
    //     price: 1086163,
    //     code: "1705"
    // }, {
    //     link: "italfrigo_toscana_wl_self_2500.html",
    //     title: "Italfrigo Toscana WL Self ВПС 2500 Д",
    //     desc: "Витрина открытого типа Italfrigo Toscana WL Self ВПС 2500 Д (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
    //     img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_wl_self_1.jpg",
    //     price: 1304045,
    //     code: "1706"
    // }, {
    //     link: "italfrigo_toscana_wl_self_3750.html",
    //     title: "Italfrigo Toscana WL Self ВПС 3750 Д",
    //     desc: "Витрина открытого типа Italfrigo Toscana WL Self ВПС 3750 Д (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
    //     img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_wl_self_1.jpg",
    //     price: 1751201,
    //     code: "1707"
    // }, 
    {
        link: "italfrigo_toscana_q.html",
        title: "Italfrigo Toscana Quadro",
        desc: "Витрина открытого типа Italfrigo Toscana Quadro (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_q_1.jpg",
        price: 1020941,
        code: "1708"
    }, {
        link: "italfrigo_toscana_q_self.html",
        title: "Italfrigo Toscana Quadro Self",
        desc: "Витрина открытого типа Italfrigo Toscana Quadro Self (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_q_self_1.jpg",
        price: 858469,
        code: "1709"
    }, {
        link: "italfrigo_toscana_q_bm.html",
        title: "Italfrigo Toscana Quadro BM (Тепловая)",
        desc: "Витрина открытого типа Italfrigo Toscana Quadro BM (Тепловая) (выносной агрегат) предназначена для демонстрации предназначен для экспозиции, продажи и кратковременного хранения охлажденной рыбы и морепродуктов. Отличается стильным кубическим дизайном, максимальной обзорностью выкладки и отсутствием бликов на стекле.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_toscana_q_bm_1.jpg",
        price: 1839697,
        code: "1710"
    }, {
        link: "italfrigo_veneto_q.html",
        title: "Italfrigo Veneto Quadro",
        desc: "Витрина универсальная Italfrigo Veneto Quadro ВПС (выносной агрегат) — предназначена для оснащения магазинов и супермаркетов среднего и крупного форматов. Отличительной особенностью данной модели является полностью прозрачное остекление за счет прозрачных стоек из оргстекла. Глубина выкладки 960 мм позволяет разместить широкий ассортимент продукции.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_veneto_q_1.jpg",
        price: 1152217,
        code: "1711"
    }, {
        link: "italfrigo_veneto_q_self.html",
        title: "Italfrigo Veneto Quadro Self",
        desc: "Витрина универсальная Italfrigo Veneto Quadro Self ВПС (выносной агрегат) — предназначена для оснащения магазинов и супермаркетов среднего и крупного форматов. Отличительной особенностью данной модели является полностью прозрачное остекление за счет прозрачных стоек из оргстекла. Глубина выкладки 960 мм позволяет разместить широкий ассортимент продукции.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_veneto_q_self_1.jpg",
        price: 986244,
        code: "1712"
    }, {
        link: "italfrigo_veneto_q_bm.html",
        title: "Italfrigo Veneto Quadro BM",
        desc: "Витрина универсальная Italfrigo Veneto Quadro BM (выносной агрегат) — предназначена для оснащения магазинов и супермаркетов среднего и крупного форматов. Отличительной особенностью данной модели является полностью прозрачное остекление за счет прозрачных стоек из оргстекла. Глубина выкладки 960 мм позволяет разместить широкий ассортимент продукции.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_veneto_q_bm_1.jpg",
        price: 2151570,
        code: "1713"
    }, {
        link: "italfrigo_veneto_crystal.html",
        title: "Italfrigo Veneto Crystal",
        desc: "Витрина универсальная Italfrigo Veneto Crystal (выносной агрегат) — предназначена для оснащения магазинов и супермаркетов среднего и крупного форматов. Отличительной особенностью данной модели является полностью прозрачное остекление за счет прозрачных стоек из оргстекла. Глубина выкладки 960 мм позволяет разместить широкий ассортимент продукции.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_veneto_crystal_1.jpg",
        price: 1152223,
        code: "1714"
    }, {
        link: "italfrigo_veneto_crystal_self.html",
        title: "Italfrigo Veneto Crystal Self",
        desc: "Витрина универсальная Italfrigo Veneto Crystal Self (выносной агрегат) — предназначена для оснащения магазинов и супермаркетов среднего и крупного форматов. Отличительной особенностью данной модели является полностью прозрачное остекление за счет прозрачных стоек из оргстекла. Глубина выкладки 960 мм позволяет разместить широкий ассортимент продукции.",
        img: "/themes/images/products/vitrina/cryspi/italfrigo_veneto_crystal_self_1.jpg",
        price: 986244,
        code: "1715"
    },
    // ______________________________Пристенные холодильные витрины________________________________________
    {
        link: "carboma_cuba.html",
        title: "Пристенная холодильная витрина Carboma Cuba",
        desc: "Холодильная витрина Carboma Cuba отличаются современным дизайном, оптимальными эргономическими показателями, эффективным уровнем энергопотребления и холодопроизводительности.Пристенная холодильная витрина CARBOMA CUBA позволяют эффективно использовать торговое пространство благодаря компактным внешним размерам и эргономичному кубическому дизайну.",
        img: "/themes/images/products/pristen/main/17.jpg",
        price: 618700,
        code: "1717"
    }, {
        link: "carboma_tokyo.html",
        title: "Пристенная холодильная витрина Carboma Tokyo",
        desc: "Пристенная холодильная витрина Carboma Tokyo - идеальное предложение для магазинов любого формата. Благодаря своим небольшим размерам при увеличенной выкладке товара, может быть использована для промо-продаж.",
        img: "/themes/images/products/pristen/main/18.jpg",
        price: 777410,
        code: "1718"
    }, {
        link: "carboma_britany.html",
        title: "Пристенная холодильная витрина Carboma Britany",
        desc: "Пристенная холодильная витрина Carboma Britany - идеальное предложение для магазинов любого формата, а также для точек общественного питания. Обеспечит активные продажи как в пристенном, так и в островном размещении, привлекая покупателей современным дизайном, оптимальным мерчандайзингом при небольших габаритных размерах.",
        img: "/themes/images/products/pristen/main/19.jpg",
        price: 480434,
        code: "1719"
    }, {
        link: "carboma_crete.html",
        title: "Пристенная холодильная витрина Carboma Crete",
        desc: "Широкий модельный ряд пристенных холодильных витрин CARBOMA CRETE отличается повышенной обзорностью продуктов за счет панорамных боковин и увеличенной площадью выкладки.",
        img: "/themes/images/products/pristen/main/20.jpg",
        price: 266019,
        code: "1720"
    }, {
        link: "carboma_provance.html",
        title: "Пристенная холодильная витрина Carboma Provance",
        desc: "Пристенная холодильная витрина Carboma Provance предназначены для торговых залов малого и среднего формата. Сочетают в себе надежность, эргономичность.",
        img: "/themes/images/products/pristen/main/21.jpg",
        price: 233079,
        code: "1721"
    }, {
        link: "carboma_polus.html",
        title: "Пристенная холодильная витрина Carboma Polus",
        desc: "Увеличенная площадь выкладки в сочетании с Пристенная холодильная витрина ПОЛЮС. Высокая функциональность и точное соблюдение температурного режима обеспечивают надежную работу стеллажа и гарантируют сохранение свежести продуктов.",
        img: "/themes/images/products/pristen/main/22.jpg",
        price: 333196,
        code: "1722"
    }, {
        link: "florence.html",
        title: "Пристенная холодильная витрина Florence",
        desc: "Пристенная холодильная витрина Florence - эффективное решение для магазинов и супермаркетов небольшой площади. Она отличается энергоемкостью, удобна и проста в эксплуатации. Florence снабжена верхним освещением, емкостью для сбора талой воды с функцией выпаривания, высокоэффективным испарителем и четырьмя полками с возможностью установки под наклоном для удобства демонстрации содержимого покупателям.",
        img: "/themes/images/products/pristen/main/1.jpg",
        price: 513810,
        code: "1723"
    }, {
        link: "varshava_bxc.html",
        title: "Пристенная холодильная витрина Varshava 210",
        desc: "Пристенная холодильная витрина Varshava 210: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин имеют возможность регулировки угла наклона полки 0°, -10° и -20°.",
        img: "/themes/images/products/pristen/main/2.jpg",
        price: 698780,
        code: "1724"
    }, {
        link: "varshava_bxc_fruit.html",
        title: "Пристенная холодильная витрина Varshava 210 фруктовая",
        desc: "Холодильная пристенная витрина Varshava фруктовая: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин имеют возможность регулировки угла наклона полки 0°, -10° и -20°.",
        img: "/themes/images/products/pristen/list/3.jpg",
        price: 618286,
        code: "1725"
    }, {
        link: "varshava_bxcp.html",
        title: "Пристенная холодильная витрина Varshava 160",
        desc: "Холодильная пристенная витрина Varshava: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин имеют возможность регулировки угла наклона полки 0°, -10° и -20°",
        img: "/themes/images/products/pristen/main/5.jpg",
        price: 669224,
        code: "1726"
    }, {
        link: "varshava_bxc_1875.html",
        title: "Пристенная холодильная витрина Varshava 220",
        desc: "Холодильная пристенная витрина Varshava: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин имеют возможность регулировки угла наклона полки 0°, -10° и -20°",
        img: "/themes/images/products/pristen/main/6.jpg",
        price: 698780,
        code: "1727"
    }, {
        link: "kupes.html",
        title: "Пристенная холодильная витрина Kupes",
        desc: "Холодильная пристенная витрина Kupes работает в среднетемпературном режиме, обеспечивая надежное хранение демонстрируемых продуктов в особых условиях. Длина полок достигает 2,5 м. Все поверхности витрины изготовлены из окрашенной стали в соответствии с санитарными нормами. Полиуретановая изоляция служит надежной защитой полезного объема от холодопотерь, повышая энергоэффективность.",
        img: "/themes/images/products/pristen/main/7.jpg",
        price: 852896,
        code: "1728"
    }, {
        link: "nova_bxcp.html",
        title: "Пристенная холодильная витрина Nova ВХСп",
        desc: "Холодильная пристенная витрина Nova ВХСп работает в среднетемпературном режиме, обеспечивая надежное хранение демонстрируемых продуктов в особых условиях. Длина полок достигает 2,5 м. Все поверхности витрины изготовлены из окрашенной стали в соответствии с санитарными нормами. Полиуретановая изоляция служит надежной защитой полезного объема от холодопотерь, повышая энергоэффективность.",
        img: "/themes/images/products/pristen/main/8.jpg",
        price: 262144,
        code: "1729"
    }, {
        link: "varshava_bxcp_1875.html",
        title: "Пристенная холодильная витрина Varshava BXCп-1,875",
        desc: "Холодильная пристенная витрина Varshava: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин серии «Varshava» имеют возможность регулировки угла наклона полки 0°, -10° и -20°.",
        img: "/themes/images/products/pristen/main/9.jpg",
        price: 908269,
        code: "1730"
    }, {
        link: "kupes_bxcp.html",
        title: "Пристенная холодильная витрина Kupes ВХСп",
        desc: "Холодильная пристенная витрина Kupes работает в среднетемпературном режиме, обеспечивая надежное хранение демонстрируемых продуктов в особых условиях. Длина полок достигает 2,5 м. Все поверхности витрины изготовлены из окрашенной стали в соответствии с санитарными нормами.",
        img: "/themes/images/products/pristen/main/10.jpg",
        price: 852896,
        code: "1731"
    }, {
        link: "varshava_bxcp_25.html",
        title: "Пристенная холодильная витрина Varshava BXCп-2,5",
        desc: "Холодильная пристенная витрина Varshava: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин имеют возможность регулировки угла наклона полки 0°, -10° и -20°.",
        img: "/themes/images/products/pristen/main/12.jpg",
        price: 1170225,
        code: "1733"
    }, {
        link: "varshava_torcevaya.html",
        title: "Пристенная холодильная витрина Varshava торцевая",
        desc: "Холодильная пристенная витрина Varshava: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин серии «Varshava» имеют возможность регулировки угла наклона полки 0°, -10° и -20°.",
        img: "/themes/images/products/pristen/list/13.jpg",
        price: 1003393,
        code: "1734"
    }, {
        link: "varshava_bxcp_375.html",
        title: "Пристенная холодильная витрина Varshava ВХСп-3,75",
        desc: "Холодильная пристенная витрина Varshava: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин серии «Varshava» имеют возможность регулировки угла наклона полки 0°, -10° и -20°.",
        img: "/themes/images/products/pristen/main/14.jpg",
        price: 1590097,
        code: "1735"
    }, {
        link: "varshava_bxcnp_375.html",
        title: "Пристенная холодильная витрина Varshava BXCнп-3,75",
        desc: "Холодильная пристенная витрина Varshava: идеально подходит для демонстрации, кратковременного хранения и продажи продуктов питания в магазинах и точках продаж любого формата. Полки витрин имеют возможность регулировки угла наклона полки 0°, -10° и -20°.",
        img: "/themes/images/products/pristen/main/15.jpg",
        price: 689465,
        code: "1736"
    }, {
        link: "barcelona.html",
        title: "Пристенная холодильная витрина Barcelona",
        desc: "Пристенная холодильная витрина Barcelona - эффективное решение для магазинов и супермаркетов небольшой площади. Она отличается энергоемкостью, удобна и проста в эксплуатации.",
        img: "/themes/images/products/pristen/main/16.jpg",
        price: 1638898,
        code: "1737"
    }, {
        link: "alt_new_s_1350.html",
        title: "Пристенный холодильник ALT NEW S 1350",
        desc: "Пристенный холодильник Cryspi ALT N S 1350 предназначена для демонстрации, охлаждения и кратковременного хранения скоропортящихся продуктов на предприятиях торговли и общественного питания. Модель оснащена 4 полками и люминесцентной подсветкой. Полки выполнены из окрашенной оцинкованной стали.",
        img: "/themes/images/products/pristen/list/23.jpg",
        price: 859144,
        code: "1720"
    }, {
        link: "alt_new_s_1950.html",
        title: "Пристенный холодильник ALT NEW S 1950",
        desc: "Пристенный холодильник Cryspi ALT N S 1950 предназначена для демонстрации, охлаждения и кратковременного хранения скоропортящихся продуктов на предприятиях торговли и общественного питания. Модель оснащена 4 полками и люминесцентной подсветкой. Полки выполнены из окрашенной оцинкованной стали.",
        img: "/themes/images/products/pristen/list/24.jpg",
        price: 1071348,
        code: ""
    }, {
        link: "gorka_snezh_garda_1250x710.html",
        title: "Горка СНЕЖ GARDA (1250 x 710)",
        desc: "Холодильная горка Снеж Garda 1250 используется на предприятиях общественного питания и торговли для охлаждения, кратковременного хранения, демонстрации и продажи напитков, мяса, птицы, колбасных, молочных и гастрономических изделий. Модель оснащена 4 навесными полками с ограничителями и ночной шторкой.",
        img: "/themes/images/products/pristen/gorka/gorka_snezh_1250x710.jpg",
        price: 787144,
        code: ""
    }, {
        link: "gorka_snezh_garda_1875x710.html",
        title: "Горка СНЕЖ GARDA (1875 x 710)",
        desc: "Холодильная горка Снеж Garda 1875 используется на предприятиях общественного питания и торговли для охлаждения, кратковременного хранения, демонстрации и продажи напитков, мяса, птицы, колбасных, молочных и гастрономических изделий. Модель оснащена 4 навесными полками с ограничителями и ночной шторкой.",
        img: "/themes/images/products/pristen/gorka/gorka_snezh_1875x710.jpg",
        price: 941474,
        code: ""
    }, {
        link: "gorka_snezh_garda_2500x710.html",
        title: "Горка СНЕЖ GARDA (2500 x 710)",
        desc: "Холодильная горка Снеж Garda 2500 используется на предприятиях общественного питания и торговли для охлаждения, кратковременного хранения, демонстрации и продажи напитков, мяса, птицы, колбасных, молочных и гастрономических изделий. Модель оснащена 4 навесными полками с ограничителями и ночной шторкой.",
        img: "/themes/images/products/pristen/gorka/gorka_snezh_2500x710.jpg",
        price: 1216584,
        code: ""
    }, {
        link: "gorka_snezh_garda_1250x830.html",
        title: "Горка СНЕЖ GARDA (1250 x 830)",
        desc: "Холодильная горка Снеж Garda 1250 используется на предприятиях общественного питания и торговли для охлаждения, кратковременного хранения, демонстрации и продажи напитков, мяса, птицы, колбасных, молочных и гастрономических изделий. Модель оснащена 4 навесными полками с ограничителями и ночной шторкой.",
        img: "/themes/images/products/pristen/gorka/gorka_snezh_1250x830.jpg",
        price: 807274,
        code: ""
    }, {
        link: "gorka_snezh_garda_1875x830.html",
        title: "Горка СНЕЖ GARDA (1875 x 830)",
        desc: "Холодильная горка Снеж Garda 1875 используется на предприятиях общественного питания и торговли для охлаждения, кратковременного хранения, демонстрации и продажи напитков, мяса, птицы, колбасных, молочных и гастрономических изделий. Модель оснащена 4 навесными полками с ограничителями и ночной шторкой.",
        img: "/themes/images/products/pristen/gorka/gorka_snezh_1875x830.jpg",
        price: 981734,
        code: ""
    }, {
        link: "gorka_snezh_garda_2500x830.html",
        title: "Горка СНЕЖ GARDA (2500 x 830)",
        desc: "Холодильная горка Снеж Garda 2500 используется на предприятиях общественного питания и торговли для охлаждения, кратковременного хранения, демонстрации и продажи напитков, мяса, птицы, колбасных, молочных и гастрономических изделий. Модель оснащена 4 навесными полками с ограничителями и ночной шторкой.",
        img: "/themes/images/products/pristen/gorka/gorka_snezh_2500x830.jpg",
        price: 1283684,
        code: ""
    },
    // ___________
    {
        link: "italfrigo_milan_s.html",
        title: "Морозильный шкаф Italfrigo Milan S D3 2343",
        desc: "Морозильный пристенный шкаф Italfrigo Milan S D3 2343 (выносной агрегат) предназначен для демонстрации, экспозиции и хранения замороженных продуктов и полуфабрикатов в магазинах любого формата.",
        img: "/themes/images/products/shkaf/crispi/1.1.jpg",
        price: 3061473,
        code: "1800"
    }, {
        link: "italfrigo_milan_L.html",
        title: "Морозильный шкаф Italfrigo Milan L",
        desc: "Морозильный пристенный шкаф Italfrigo Milan L (выносной агрегат) предназначен для демонстрации, экспозиции и хранения замороженных продуктов и полуфабрикатов в магазинах любого формата.",
        img: "/themes/images/products/shkaf/crispi/milan_l_1.jpg",
        price: 2615606,
        code: "1801"
    },
    // {
    //     link: "italfrigo_milan_L_2343.html",
    //     title: "Морозильный шкаф Italfrigo Milan L D3 2343",
    //     desc: "Морозильный пристенный шкаф Italfrigo Milan L D3 2343 (выносной агрегат) предназначен для демонстрации, экспозиции и хранения замороженных продуктов и полуфабрикатов в магазинах любого формата.",
    //     img: "/themes/images/products/shkaf/crispi/milan_l_1.jpg",
    //     price: 3423216,
    //     code: "1802"
    // }, {
    //     link: "italfrigo_milan_L_3123.html",
    //     title: "Морозильный шкаф Italfrigo Milan L D4 3123",
    //     desc: "Морозильный пристенный шкаф Italfrigo Milan L D4 3123 (выносной агрегат) предназначен для демонстрации, экспозиции и хранения замороженных продуктов и полуфабрикатов в магазинах любого формата.",
    //     img: "/themes/images/products/shkaf/crispi/milan_l_1.jpg",
    //     price: 4784861,
    //     code: "1803"
    // }, {
    //     link: "italfrigo_milan_L_3905.html",
    //     title: "Морозильный шкаф Italfrigo Milan L D5 3905",
    //     desc: "Морозильный пристенный шкаф Italfrigo Milan L D5 3905 (выносной агрегат) предназначен для демонстрации, экспозиции и хранения замороженных продуктов и полуфабрикатов в магазинах любого формата.",
    //     img: "/themes/images/products/shkaf/crispi/milan_l_1.jpg",
    //     price: 5762440,
    //     code: "1804"
    // }, 
    {
        link: "italfrigo_lazio_s9.html",
        title: "Пристенная витрина Italfrigo Lazio S9",
        desc: "Пристенная холодильная витрина – прилавок Italfrigo Lazio S9 (выносной агрегат) предназначена для демонстрации, продажи и кратковременного хранения предварительно охлаждённых до температуры охлаждаемого объема пищевых продуктов.",
        img: "/themes/images/products/shkaf/crispi/italfrigo_lazio_1.jpg",
        price: 889203,
        code: "1805"
    },
    // {
    //     link: "italfrigo_lazio_s9_1875.html",
    //     title: "Пристенная витрина Italfrigo Lazio S9 1875 Д",
    //     desc: "Пристенная холодильная витрина – прилавок Italfrigo Lazio S9 (выносной агрегат) предназначена для демонстрации, продажи и кратковременного хранения предварительно охлаждённых до температуры охлаждаемого объема пищевых продуктов.",
    //     img: "/themes/images/products/shkaf/crispi/italfrigo_lazio_1.jpg",
    //     price: 1122457,
    //     code: "1806"
    // }, {
    //     link: "italfrigo_lazio_s9_2500.html",
    //     title: "Пристенная витрина Italfrigo Lazio S9 2500 Д",
    //     desc: "Пристенная холодильная витрина – прилавок Italfrigo Lazio S9 (выносной агрегат) предназначена для демонстрации, продажи и кратковременного хранения предварительно охлаждённых до температуры охлаждаемого объема пищевых продуктов.",
    //     img: "/themes/images/products/shkaf/crispi/italfrigo_lazio_1.jpg",
    //     price: 1327970,
    //     code: "1807"
    // }, {
    //     link: "italfrigo_lazio_s9_3750.html",
    //     title: "Пристенная витрина Italfrigo Lazio S9 3750 Д",
    //     desc: "Пристенная холодильная витрина – прилавок Italfrigo Lazio S9 (выносной агрегат) предназначена для демонстрации, продажи и кратковременного хранения предварительно охлаждённых до температуры охлаждаемого объема пищевых продуктов.",
    //     img: "/themes/images/products/shkaf/crispi/italfrigo_lazio_1.jpg",
    //     price: 1794475,
    //     code: "1808"
    // }, 
    {
        link: "italfrigo_lazio_s9_1875_torec.html",
        title: "Пристенная витрина Italfrigo Lazio S9 1875 Д торец",
        desc: "Пристенная холодильная витрина – прилавок Italfrigo Lazio S9 (выносной агрегат) предназначена для демонстрации, продажи и кратковременного хранения предварительно охлаждённых до температуры охлаждаемого объема пищевых продуктов.",
        img: "/themes/images/products/shkaf/crispi/italfrigo_lazio_1.jpg",
        price: 1327885,
        code: "1809"
    }, {
        link: "italfrigo_rimini_l7.html",
        title: "Пристенная витрина Italfrigo Rimini L7",
        desc: "Холодильная пристенная витрина Italfrigo Rimini L7 (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_1.jpg",
        price: 1008706,
        code: "1810"
    }, {
        link: "italfrigo_rimini_l9.html",
        title: "Пристенная витрина Italfrigo Rimini L9",
        desc: "Холодильная пристенная витрина Italfrigo Rimini L9 (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_1.jpg",
        price: 1008706,
        code: "1811"
    }, {
        link: "italfrigo_rimini_h9.html",
        title: "Пристенная витрина Italfrigo Rimini H9",
        desc: "Холодильная пристенная витрина Italfrigo Rimini H9 (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_1.jpg",
        price: 1071231,
        code: "1812"
    }, {
        link: "italfrigo_rimini_h10.html",
        title: "Пристенная витрина Italfrigo Rimini H10",
        desc: "Холодильная пристенная витрина Italfrigo Rimini H10 (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_1.jpg",
        price: 1144311,
        code: "1813"
    }, {
        link: "italfrigo_rimini_l7_dg.html",
        title: "Пристенная витрина Italfrigo Rimini L7 DG",
        desc: "Холодильная пристенная витрина Italfrigo Rimini L7 DG (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_DG_1.jpg",
        price: 1031674,
        code: "1814"
    }, {
        link: "italfrigo_rimini_h7_dg.html",
        title: "Пристенная витрина Italfrigo Rimini H7 DG",
        desc: "Холодильная пристенная витрина Italfrigo Rimini H7 DG (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_DG_1.jpg",
        price: 1041983,
        code: "1815"
    }, {
        link: "italfrigo_rimini_l9_dg.html",
        title: "Пристенная витрина Italfrigo Rimini L9 DG",
        desc: "Холодильная пристенная витрина Italfrigo Rimini L9 DG (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_DG_1.jpg",
        price: 1149320,
        code: "1816"
    }, {
        link: "italfrigo_rimini_h9_dg.html",
        title: "Пристенная витрина Italfrigo Rimini H9 DG",
        desc: "Холодильная пристенная витрина Italfrigo Rimini H9 DG (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_DG_1.jpg",
        price: 1169079,
        code: "1817"
    }, {
        link: "italfrigo_rimini_h10_dg.html",
        title: "Пристенная витрина Italfrigo Rimini H10 DG",
        desc: "Холодильная пристенная витрина Italfrigo Rimini H10 DG (выносной агрегат) предназначена для демонстрации, охлаждения и кратковременного хранения молочных и гастрономических изделий на предприятиях общественного питания и торговли.",
        img: "/themes/images/products/pristen/cryspi/italfrigo_rimini_l7_DG_1.jpg",
        price: 1190267,
        code: "1818"
    },
    // __________________________________Кондитерские витрины__________________________________________
    {
        link: "veneto.html",
        title: "Кондитерский шкаф Veneto",
        desc: "Холодильная витрина Veneto является моделью бизнес-класса. Данная витрина украсит интерьер торговой точки любого формата: ресторана, кафе, бара, фойе отеля, магазина, кондитерской или супермаркета. Холодильная витрина Veneto идеально подходит для демонстрации и реализации: тортов, выпечки, кремовых пирожных и печенья, шоколадных изделий, пиццы, свежих салатов, цветов.",
        img: "/themes/images/products/kondit/main/12.jpg",
        price: 583098,
        code: "2001"
    }, {
        link: "carboma_bxcb.html",
        title: "Кондитерская витрина Carboma ВХСв - 1,3д (ОТКРЫТАЯ)",
        desc: "Кондитерская витрина Carboma ВХСв - 1,3д (ОТКРЫТАЯ) идеальна для стильной демонстрации выпечки, тортов, пироженых, пиццы. Открытая выкладка используется для удобства клиента и стеклянные полки с подсветкой представляют товар с наилучшей стороны. Ночные шторки будет идеальным решением для экономии энергии.",
        img: "/themes/images/products/kondit/list/1.jpg",
        price: 347010,
        code: "2009"
    }, {
        link: "carboma_bxcb_09.html",
        title: "Кондитерская витрина Carboma",
        desc: "Кондитерская витрина Carboma были разработаны в качестве самого компактного предложения из напольных кондитерских холодильных витрин. Благодаря наличию вентиляции к охлаждаемой демонстрационной поверхности теперь можно отнести и 3 полки.",
        img: "/themes/images/products/kondit/list/2.jpg",
        price: 441698,
        code: "2010"
    }, {
        link: "carboma_latium.html",
        title: "Кондитерские шкафы Carboma Latium",
        desc: "Кондитерская витрина Carboma Latium предназначены для демонстрации кондитерских изделий и десертов в магазинах, кафе, ресторанах. Стеклопакеты обеспечивают хорошую теплоизоляцию и обзор внутреннего объема со всех сторон.",
        img: "/themes/images/products/kondit/main/7.jpg",
        price: 310964,
        code: "2015"
    }, {
        link: "carboma_lux.html",
        title: "Кондитерские шкафы Carboma Lux",
        desc: "Кондитерская витрина Carboma LUX - идеальный вариант для демонстрации кондитерских изделий, аппетитных сэндвичей и бутербродов, выпечки, пиццы и деликатесов в кафе, барах и ресторанах.",
        img: "/themes/images/products/kondit/main/77.jpg",
        price: 580502,
        code: "2016"
    }, {
        link: "carboma_mini.html",
        title: "Кондитерская витрина Carboma Mini",
        desc: "Небольшой охлаждаемый прилавок с динамическим охлаждением и современным техническим оснащением — именно такова кондитерская витрина Carboma MINI. Она вмещает довольно много продуктов, так как имеет дополнительную полку с охлаждением и LED-подсветкой.",
        img: "/themes/images/products/kondit/list/3.jpg",
        price: 432014,
        code: "2011"
    }, {
        link: "carboma_cube.html",
        title: "Кондитерская витрина Carboma Cube",
        desc: "Кондитерская витрина Carboma Cube подходит для продажи из нее слоек, булочек и другой выпечки. Эта небольшая витрина вместительна благодаря трем стеклянным полочкам. Равномерное охлаждение обеспечивается динамической вентиляцией.",
        img: "/themes/images/products/kondit/list/4.jpg",
        price: 425020,
        code: "2012"
    }, {
        link: "polus.html",
        title: "Кондитерская витрина Полюс",
        desc: "Кондитерская витрина ПОЛЮС применяются для продажи кондитерских изделий (тортов, пирогов, десертов) в охлаждённом виде. Эти витрины, обладая статической системе охлаждения создают более приемлемые условия для хранения нежной кулинарной продукции.",
        img: "/themes/images/products/kondit/main/5.png",
        price: 440622,
        code: "2013"
    }, {
        link: "polus_eco.html",
        title: "Кондитерская витрина Полюс Эко",
        desc: "Кондитерская витрина ПОЛЮС ЭКО разработан для удовлетворения требований выставления товара и создания индивидуальных решений в магазинах любого формата. Узкие кондитерские витрины Полюс были разработаны в качестве самого экономичного предложения из напольных кондитерских холодильных витрин.",
        img: "/themes/images/products/kondit/main/6.jpg",
        price: 153173,
        code: "2014"
    }, {
        link: "veneto_vs.html",
        title: "Кондитерская витрина Veneto VS-0,95",
        desc: "Кондитерская витрина Veneto VS-0,95 - отличное сочетание дизайна, цены, необходимой функциональности и качества. Витрины Veneto с успехом позволяет оснастить небольшое кафе или кондитерский магазин. Модельный ряд представлен не только прямыми секциями, но и угловыми решениями под 45 градусов.",
        img: "/themes/images/products/kondit/mxm/list/4.jpg",
        price: 574645,
        code: "2002"
    }, {
        link: "veneto_vs_095.html",
        title: "Кондитерская витрина Veneto VS-0,95",
        desc: "Кондитерская витрина Veneto VS-0,95 (статика) - отличное сочетание дизайна, цены, необходимой функциональности и качества. Витрины Veneto с успехом позволяет оснастить небольшое кафе или кондитерский магазин. Модельный ряд представлен не только прямыми секциями, но и угловыми решениями под 45 градусов.",
        img: "/themes/images/products/kondit/mxm/list/6.jpg",
        price: 417275,
        code: "2003"
    }, {
        link: "vs_un.html",
        title: "Кондитерская витрина Veneto VS-UN",
        desc: "• стильный дизайн; • светодиодная подсветка охлаждаемого объема каждой полки; • принудительная вентиляция охлажденного воздуха обеспечивает равномерное распределение температур внутри витрины; • в витринах Veneto применяется двойной стеклопакет.",
        img: "/themes/images/products/kondit/mxm/list/8.jpg",
        price: 711479,
        code: "2004"
    }, {
        link: "veneto_vsk.html",
        title: "Кондитерская витрина Veneto VSk",
        desc: "Кондитерская витрина Veneto идеально подходит для демонстрации кондитерских изделий, мясных и рыбных деликатесов для кафе, баров и магазинов любого формата. Модельный ряд представлен не только прямыми секциями, но и угловыми решениями под 45 градусов.",
        img: "/themes/images/products/kondit/mxm/list/11.jpg",
        price: 681947,
        code: "2005"
    }, {
        link: "veneto_vsn.html",
        title: "Кондитерская витрина VSn",
        desc: "Кондитерская витрина VSn украсит интерьер торговой точки любого формата: ресторана, кафе, бара, фойе отеля, магазина, кондитерской или супермаркета. Кондитерская витрина идеально подходит для демонстрации и реализации: тортов, выпечки, кремовых пирожных и печенья, шоколадных изделий, пиццы, свежих салатов, цветов.",
        img: "/themes/images/products/kondit/mxm/list/12.jpg",
        price: 568591,
        code: "2006"
    }, {
        link: "veneto_vso.html",
        title: "Кондитерская витрина VSo",
        desc: "Холодильная витрина Veneto VSo может применяться заведениями общепита и в торговле для выкладки и хранения хлебобулочных и кондитерских изделий. Кондитерская витрина имеет динамическую систему охлаждения с мощным компрессором. Способ оттаивания - естественными теплопритоками.",
        img: "/themes/images/products/kondit/mxm/list/15.jpg",
        price: 675710,
        code: "2007"
    }, {
        link: "veneto_vsp.html",
        title: "Кондитерская витрина пристенного типа Veneto VSp",
        desc: "Холодильная витрина Veneto VSo может применяться заведениями общепита и в торговле для выкладки и хранения хлебобулочных и кондитерских изделий. Кондитерская витрина имеет динамическую систему охлаждения с мощным компрессором. Способ оттаивания - естественными теплопритоками.",
        img: "/themes/images/products/kondit/main/20.jpg",
        price: 909119,
        code: "2008"
    }, {
        link: "adagio_classic_900.html",
        title: "КОНДИТЕРСКАЯ ВИТРИНА ADAGIO Classic К 900Д",
        desc: "Cтильная, компактная кондитерская витрина со ферическим стеклом. Закаленные стекла с шелкографией придают эстетическую привлекательность витрине. Благодаря фронтальному и боковому остеклению обеспечивается наилучшая обзорность выкладки. Благодаря продуманному конструктиву, витрина ADAGIO Classic легко компонуется в линию с витриной ADAGIO Quadro и кондитерским неохлаждаемым прилавком ADAGIO КНП, образуя единую стилистическую композицию заданной функциональности. Три ряда полок различной глубины обеспечивают экспозицию различного ассортимента, а тёплая LED-подсветка каждой полки создает дополнительный акцент на десертах.",
        img: "/themes/images/products/kondit/main/adagio_classic_900_2.jpg",
        price: 440859,
        code: ""
    }, {
        link: "adagio_classic_1200.html",
        title: "КОНДИТЕРСКАЯ ВИТРИНА ADAGIO Classic К 1200Д",
        desc: "Cтильная, компактная кондитерская витрина со ферическим стеклом. Закаленные стекла с шелкографией придают эстетическую привлекательность витрине. Благодаря фронтальному и боковому остеклению обеспечивается наилучшая обзорность выкладки. Благодаря продуманному конструктиву, витрина ADAGIO Classic легко компонуется в линию с витриной ADAGIO Quadro и кондитерским неохлаждаемым прилавком ADAGIO КНП, образуя единую стилистическую композицию заданной функциональности. Три ряда полок различной глубины обеспечивают экспозицию различного ассортимента, а тёплая LED-подсветка каждой полки создает дополнительный акцент на десертах.",
        img: "/themes/images/products/kondit/main/adagio_classic_1200.jpg",
        price: 486853,
        code: ""
    }, {
        link: "adagio_cube_900.html",
        title: "КОНДИТЕРСКАЯ ВИТРИНА ADAGIO Cube К 900Д",
        desc: "Cтильная, компактная кондитерская витрина со ферическим стеклом. Закаленные стекла с шелкографией придают эстетическую привлекательность витрине. Благодаря фронтальному и боковому остеклению обеспечивается наилучшая обзорность выкладки. Благодаря продуманному конструктиву, витрина ADAGIO Cube легко компонуется в линию с витриной ADAGIO Classic и кондитерским неохлаждаемым прилавком ADAGIO КНП, образуя единую стилистическую композицию заданной функциональности. Три ряда полок различной глубины обеспечивают экспозицию различного ассортимента, а тёплая LED-подсветка каждой полки создает дополнительный акцент на десертах.",
        img: "/themes/images/products/kondit/main/adagio_cube_900_2.jpg",
        price: 477532,
        code: ""
    }, {
        link: "adagio_cube_1200.html",
        title: "КОНДИТЕРСКАЯ ВИТРИНА ADAGIO Cube К 1200Д",
        desc: "Cтильная, компактная кондитерская витрина со ферическим стеклом. Закаленные стекла с шелкографией придают эстетическую привлекательность витрине. Благодаря фронтальному и боковому остеклению обеспечивается наилучшая обзорность выкладки. Благодаря продуманному конструктиву, витрина ADAGIO Cube легко компонуется в линию с витриной ADAGIO Classic и кондитерским неохлаждаемым прилавком ADAGIO КНП, образуя единую стилистическую композицию заданной функциональности. Три ряда полок различной глубины обеспечивают экспозицию различного ассортимента, а тёплая LED-подсветка каждой полки создает дополнительный акцент на десертах.",
        img: "/themes/images/products/kondit/main/adagio_cube_1200.jpg",
        price: 504116,
        code: ""
    }, {
        link: "adagio_knp_600.html",
        title: "Кассовый неохлаждаемый прилавок ADAGIO КНП 600",
        desc: "КНП – функциональное решение для организации прикассовой зоны и проведения расчётов, передачи заказа клиенту. Прилавок обеспечивает комфортную работу персонала кондитерского отдела. Для размещения инвентаря и вспомогательных материалов, сзади прилавка расположен выдвижной ящик глубиной 180 мм и открытые полки. Регулируемые по высоте опоры позволяют выставить прилавок ровно по уровню, не зависимо от погрешностей поверхности пола торгового зала.",
        img: "/themes/images/products/kondit/main/adagio_knp_600_2.jpg",
        price: 115765,
        code: ""
    }, {
        link: "adagio_knp_900.html",
        title: "Кассовый неохлаждаемый прилавок ADAGIO КНП 900",
        desc: "Кассовый неохлаждаемый прилавок ADAGIO КНП функциональное решение для организации прикассовой зоны и проведения расчётов, передачи заказа клиенту. Благодаря продуманному конструктиву, кондитерская неохлаждаемая прилавка ADAGIO КНП легко компонуется в линию с витриной ADAGIO Classic и с витриной ADAGIO Сube, образуя единую стилистическую композицию заданной функциональности. Три ряда полок различной глубины обеспечивают экспозицию различного ассортимента, а тёплая LED-подсветка каждой полки создает дополнительный акцент на десертах.",
        img: "/themes/images/products/kondit/main/adagio_knp_900.jpg",
        price: 140767,
        code: ""
    },
    // _________________________________________Бонеты____________________________________________________
    {
        link: "boneta_kalipso.html",
        title: "Бонета Kalipso",
        desc: "Бонета Kalipso низкотемпературная предназначена для демонстрации, кратковременного хранения и продажи, предварительно замороженных до температуры охлаждаемого объёма, пищевых продуктов, в том числе полуфабрикатов, на предприятиях торговли и общественного питания. Витрина обеспечивает хранение продуктов в диапазоне температур полезного объема не выше минус 18°С.",
        img: "/themes/images/products/boneta/list/1.jpg",
        price: 3570220,
        code: "1801"
    }, {
        link: "boneta_kupec.html",
        title: "Бонета Кupec",
        desc: "• Внутренняя облицовка, полки из стали, окрашенной белой порошковой краской; • Корпус из окрашенной оцинкованной стали с пенополиуретановым заполнением; • Пластиковые боковины с пенополиуретановым заполнением; • Ценникодержатели для полок надстройки; • Полки-решетки и перегородки из стальной проволоки, оцинкованные, окрашенные порошковой краской;",
        img: "/themes/images/products/boneta/list/3.jpg",
        price: 662184,
        code: "1803"
    }, {
        link: "boneta_malta.html",
        title: "Бонета Malta",
        desc: "Предназначена для демонстрации, кратковременного хранения и продажи, предварительно охлаждённых до температуры охлаждаемого объёма пищевых продуктов, на предприятиях торговли и общественного питания.",
        img: "/themes/images/products/boneta/list/4.jpg",
        price: 885883,
        code: "1804"
    }, {
        link: "boneta_rica.html",
        title: "Бонета Rica",
        desc: "Предназначена для демонстрации, кратковременного хранения и продажи, предварительно охлаждённых до температуры охлаждаемого объёма пищевых продуктов, на предприятиях торговли и общественного питания.",
        img: "/themes/images/products/boneta/list/5.jpg",
        price: 605179,
        code: "1805"
    }, {
        link: "boneta_bonvini.html",
        title: "Бонета Bonvini (со съемными створками)",
        desc: "Предназначена для демонстрации, кратковременного хранения и продажи, предварительно охлаждённых до температуры охлаждаемого объёма пищевых продуктов, на предприятиях торговли и общественного питания.",
        img: "/themes/images/products/boneta/moroz/list/1.JPG",
        price: 696000,
        code: "1806"
    }, {
        link: "boneta_bfg.html",
        title: "Бонета BFG с гнутым стеклом",
        desc: "Благодаря итальянским дизайнерам изменился и внешний вид новых бонет. Он стал более гармоничным и современным. Такая совокупность потребительских и эстетических качеств бонет, делает их лучшим предложением на рынке по соотношению цены и качества. Морозильная бонета закрытого типа «Bonvini BFG», может работать как в морозильном, так и в холодильном режиме.",
        img: "/themes/images/products/boneta/moroz/list/6.jpg",
        price: 681500,
        code: "1807"
    }, {
        link: "boneta_torcevaya.html",
        title: "Бонета BFG торцевая",
        desc: "Морозильная бонета закрытого типа может работать как в морозильном, так и в холодильном режиме. Энергосбережение, а так же высокое качество комплектации и сборки, являются важнейшими характеристиками данной бонеты.",
        img: "/themes/images/products/boneta/moroz/list/4.jpg",
        price: 688460,
        code: "1808"
    }, {
        link: "boneta_bf.html",
        title: "Бонета BF",
        desc: "Благодаря итальянским дизайнерам изменился и внешний вид новых бонет. Он стал более гармоничным и современным. Такая совокупность потребительских и эстетических качеств бонет, делает их лучшим предложением на рынке по соотношению цены и качества. Морозильная бонета закрытого типа «Bonvini BFG», может работать как в морозильном, так и в холодильном режиме.",
        img: "/themes/images/products/boneta/moroz/list/7.JPG",
        price: 696000,
        code: "1809"
    }, {
        link: "boneta_lvn_1850.html",
        title: "Бонета Italfrost ЛВН 1850",
        desc: "Лари-бонеты Italfrost (со встроенным статическим холодоснабжением) предназначены для хранения и демонстрации замороженных овощей и ягод, мороженого, а также мясных и рыбных полуфабрикатов. Разнообразие дополнительных опций позволяет гибко подходить к оснащению торговых площадей: возможна установка в остров с суперструктурой,с использованием торцевых модулей, а также стандартное пристенное расположение.",
        img: "/themes/images/products/boneta/moroz/list/19.jpg",
        price: 675742,
        code: ""
    }, {
        link: "boneta_lvn_1850_torec.html",
        title: "Бонета Italfrost ЛВН 1850 (торцевая)",
        desc: "Морозильная бонета ЛВН 1850 (торцевая) предназначена для хранения и демонстрации свежезамороженных продуктов. Конструкция с панорамными стеклянными раздвижными крышками и внутренним освещением идеальна для оснащения супер- и гипермаркетов.",
        img: "/themes/images/products/boneta/moroz/list/22.jpg",
        price: 704803,
        code: ""
    }, {
        link: "boneta_lvn_2100.html",
        title: "Бонета Italfrost ЛВН 2100",
        desc: "Лари-бонеты Italfrost (со встроенным статическим холодоснабжением) предназначены для хранения и демонстрации замороженных овощей и ягод, мороженого, а также мясных и рыбных полуфабрикатов. Разнообразие дополнительных опций позволяет гибко подходить к оснащению торговых площадей: возможна установка в остров с суперструктурой,с использованием торцевых модулей, а также стандартное пристенное расположение.",
        img: "/themes/images/products/boneta/moroz/list/19.1.jpg",
        price: 704800,
        code: ""
    }, {
        link: "boneta_lvn_2500.html",
        title: "Бонета Italfrost ЛВН 2500",
        desc: "Лари-бонеты Italfrost (со встроенным статическим холодоснабжением) предназначены для хранения и демонстрации замороженных овощей и ягод, мороженого, а также мясных и рыбных полуфабрикатов. Разнообразие дополнительных опций позволяет гибко подходить к оснащению торговых площадей: возможна установка в остров с суперструктурой,с использованием торцевых модулей, а также стандартное пристенное расположение.",
        img: "/themes/images/products/boneta/moroz/list/19.2.jpg",
        price: 726604,
        code: ""
    },
    // ______________________________________Морозильные лари_______________________________________________
    {
        link: "lar_gnutyi.html",
        title: "Морозильный ларь с гнутым стеклом красный",
        desc: "Морозильный ларь с гнутым стеклом красный оснащен стеклянной, выпуклой крышкой, с помощью которой легко можно рассмотреть содержимое морозильника, легок при открытии. Благодаря своему дизайну, широко используется для наглядности товаров. Морозильные лари представлены в разных объемах. Благодаря усовершенствованию корпуса морозильного ларя, ему требуется малое время для выхода на рабочую температуру. Кроме того, он отлично держит мороз даже при отключении электричества.",
        img: "/themes/images/products/lar/list/5.jpg",
        price: 192466,
        code: "2100"
    }, {
        link: "lar_gnutyi_siniy.html",
        title: "Морозильный ларь с гнутым стеклом синий",
        desc: "Морозильный ларь с гнутым стеклом синий оснащен стеклянной, выпуклой крышкой, с помощью которой легко можно рассмотреть содержимое морозильника, легок при открытии. Благодаря своему дизайну, широко используется для наглядности товаров. Морозильные лари представлены в разных объемах. Благодаря усовершенствованию корпуса морозильного ларя, ему требуется малое время для выхода на рабочую температуру. Кроме того, он отлично держит мороз даже при отключении электричества.",
        img: "/themes/images/products/lar/list/55.jpg",
        price: 192466,
        code: "2103"
    }, {
        link: "lar_gnutyi_seryi.html",
        title: "Морозильный ларь с гнутым стеклом серый",
        desc: "Морозильный ларь с гнутым стеклом серый оснащен стеклянной, выпуклой крышкой, с помощью которой легко можно рассмотреть содержимое морозильника, легок при открытии. Благодаря своему дизайну, широко используется для наглядности товаров. Морозильные лари представлены в разных объемах. Благодаря усовершенствованию корпуса морозильного ларя, ему требуется малое время для выхода на рабочую температуру. Кроме того, он отлично держит мороз даже при отключении электричества.",
        img: "/themes/images/products/lar/list/555.jpg",
        price: 192466,
        code: "2104"
    }, {
        link: "lar_gluhoi.html",
        title: "Морозильный ларь с глухой крышкой",
        desc: "Морозильный ларь с глухой крышкой обычно устанавливают в киосках или подсобных помещениях для хранения товарного запаса. Профессиональная холодильная система, рассчитанная на более интенсивное по сравнению с точками общепита и торговли использование, что позволяет очень экономично, без проблем, пользоваться ларями долгие годы.",
        img: "/themes/images/products/lar/main/12.png",
        price: 175258,
        code: "2101"
    }, {
        link: "lar_pryamoi.html",
        title: "Морозильный ларь с прямым стеклом красный",
        desc: "Морозильный ларь с прямым стеклом красный имеет точно просчитанный тепловой баланс, что гарантирует долгое и безопасное хранение продуктов. Морозильный ларь с прямым стеклом экологичен, противопожарен и обладает высокой электро безопасностью. Это делает его незаменимым в сетевых супермаркетах, где покупатели сами берут продукты. Представлен в нескольких цветовых расцветках.",
        img: "/themes/images/products/lar/list/17.jpg",
        price: 180379,
        code: "2102"
    }, {
        link: "lar_pryamoi_siniy.html",
        title: "Морозильный ларь с прямым стеклом синий",
        desc: "Морозильный ларь с прямым стеклом синий имеет точно просчитанный тепловой баланс, что гарантирует долгое и безопасное хранение продуктов. Морозильный ларь с прямым стеклом экологичен, противопожарен и обладает высокой электро безопасностью. Это делает его незаменимым в сетевых супермаркетах, где покупатели сами берут продукты. Представлен в нескольких цветовых расцветках.",
        img: "/themes/images/products/lar/list/1777.jpg",
        price: 180379,
        code: "2105"
    }, {
        link: "lar_pryamoi_seryi.html",
        title: "Морозильный ларь с прямым стеклом серый",
        desc: "Морозильный ларь с прямым стеклом серый имеет точно просчитанный тепловой баланс, что гарантирует долгое и безопасное хранение продуктов. Морозильный ларь с прямым стеклом экологичен, противопожарен и обладает высокой электро безопасностью. Это делает его незаменимым в сетевых супермаркетах, где покупатели сами берут продукты. Представлен в нескольких цветовых расцветках.",
        img: "/themes/images/products/lar/list/177.jpg",
        price: 180379,
        code: "2106"
    },
    // __________________________________Настольные витрины_________________________________________
    {
        link: "argo_87.html",
        title: "Настольные витрины ARGO A87",
        desc: "Настольные витрины ARGO A87 - широко востребованное и незаменимое оборудование для небольших торговых предприятий и заведений общественного питания.",
        img: "/themes/images/products/nastol/main/1.jpg",
        price: 195294,
        code: "2301"
    }, {
        link: "argo_xl.html",
        title: "Настольные витрины ARGO XL",
        desc: "Настольные витрины ARGO XL - идеальное предложение для кафе, баров, рынков.",
        img: "/themes/images/products/nastol/main/2.jpg",
        price: 307198,
        code: "2302"
    }, {
        link: "cube_argo_xl_texno.html",
        title: "Настольные витрины CUBE АРГО XL ТЕХНО",
        desc: "Настольные витрины CUBE АРГО XL ТЕХНО предназначены для демонстрации как готовых к употреблению продуктов питания, так и полуфабрикатов.",
        img: "/themes/images/products/nastol/main/3.jpg",
        price: 285140,
        code: "2303"
    }, {
        link: "argo_xl_texno.html",
        title: "Настольные витрины АРГО XL ТЕХНО",
        desc: "Настольные витрины АРГО XL ТЕХНО предназначены для демонстрации как готовых к употреблению продуктов питания, так и полуфабрикатов.",
        img: "/themes/images/products/nastol/main/4.jpg",
        price: 258778,
        code: "2304"
    }, {
        link: "bar_carboma.html",
        title: "Барные витрины Carboma",
        desc: "Барные витрины Carboma предназначены для кратковременного хранения, презентации и продажи суши, бутербродов, мяса, птицы, салатов, десертов, в магазинах, кафе, барах, ресторанах.",
        img: "/themes/images/products/nastol/main/5.jpg",
        price: 217890,
        code: "2305"
    }, {
        link: "teplovye_carboma.html",
        title: "Тепловые витрины CARBOMA",
        desc: "Тепловые витрины Carboma используются в магазинах, пунктах быстрого питания для поддержания подуктов в горячем состоянии.",
        img: "/themes/images/products/nastol/main/6.jpg",
        price: 217890,
        code: "2306"
    }, {
        link: "sushi_case.html",
        title: "Суши-кейсы Carboma",
        desc: "Cуши-кейсы Carboma предназначены для кратковременного хранения популярных японских блюд, таких как суши, сашими, роллы и др. Распределение холода производится снизу и сверху равномерно, что не дает заветриваться продуктам и сберегает их от замораживания и высыхания.",
        img: "/themes/images/products/nastol/main/7.jpg",
        price: 207130,
        code: "2307"
    }, {
        link: "ingredient_carboma.html",
        title: "Витрины для ингредиентов Carboma",
        desc: "Витрины для ингредиентов Carboma могут использоваться вместе со столами для пиццы и как отдельные единицы холодильного оборудования.",
        img: "/themes/images/products/nastol/main/8.jpg",
        price: 177540,
        code: "2308"
    }, {
        link: "bar_argo.html",
        title: "Барные витрины ARGO",
        desc: "Барные витрины ARGO предназначены для кратковременного хранения компонентов пиццы, суши. салатов в магазинах, кафе, барах.",
        img: "/themes/images/products/nastol/main/9.jpg",
        price: 199060,
        code: "2309"
    }, {
        link: "vitrina_dlya_ikry.html",
        title: "Витрина для икры и пресервов",
        desc: "Холодильная витрина для икры и пресервов предназначена для демонстрации и продажи икры, рыбных деликатесов и пресервов с учетом всех требований к условиям хранения и экспозиции этих деликатесных продуктов",
        img: "/themes/images/products/nastol/main/10.jpg",
        price: 131248,
        code: "2310"
    },
    // ________________________________Холодильные столы____________________________________________
    {
        link: "carboma_250.html",
        title: "Холодильные столы 570 BAR",
        desc: "Холодильные столы глубиной 570 мм - универсальное оборудование, совмещающее функции холодильного шкафа и полноценного рабочего стола. Цвет корпуса могут быть светлыми, а также темными. Данные столы могут использоваться как самостоятельная единица оборудования, так и встраиваться в барные стойки.",
        img: "/themes/images/products/stol/main/1.jpg",
        price: 404576,
        code: "2201"
    }, {
        link: "stol_polus.html",
        title: "Столы под кофемашины",
        desc: "Холодильные столы глубиной 570 мм могут быть использованы под кофемашины и для хранения молока и кофейных зерен. В данных столах предусмотрен удобный отсек для выбивания холдера кофемашины.",
        img: "/themes/images/products/stol/main/2.png",
        price: 354542,
        code: "2202"
    }, {
        link: "carboma_2g.html",
        title: "Холодильные столы с боковым агрегатом",
        desc: "Серия холодильных столов глубиной 700 мм, с боковым отсеком для холодильного/морозильного агрегата - предназначена для использования в гастрономических отделах торговых павильонов, столовых, кафе, баров, ресторанов. Цвет корпуса могут быть светлыми, а также темными.",
        img: "/themes/images/products/stol/main/3.jpg",
        price: 477245,
        code: "2203"
    }, {
        link: "carboma_360.html",
        title: "Холодильные столы с нижним агрегатом",
        desc: "Холодильные столы глубиной 700 мм, с нижним расположением холодильного / морозильного агрегата - это многофункциональное оборудование из нержавеющей стали для предприятий общественного питания и торговли. Цвет корпуса могут быть светлыми, а также темными.",
        img: "/themes/images/products/stol/main/4.jpg",
        price: 408208,
        code: "2204"
    }, {
        link: "carboma_4g.html",
        title: "Холодильные столы для салатов",
        desc: "Серия холодильных столов глубиной 700 мм, предназначены для приготовления салатов и холодных закусок. Цвет корпуса могут быть светлыми, а также темными. Благодаря равномерному охлаждению и размещению продуктов в отдельных гастроемкостях продукты долгое время сохраняют свою свежесть, а ароматы разных блюд не смешиваются.",
        img: "/themes/images/products/stol/main/5.jpg",
        price: 519708,
        code: "2205"
    }, {
        link: "carboma_nad.html",
        title: "Холодильные столы для салатов с надстройкой",
        desc: "Серия холодильных столов глубиной 700 мм, предназначены для приготовления салатов и холодных закусок. Цвет корпуса могут быть светлыми, а также темными. Благодаря равномерному охлаждению и размещению продуктов в отдельных гастроемкостях продукты долгое время сохраняют свою свежесть, а ароматы разных блюд не смешиваются.",
        img: "/themes/images/products/stol/main/6.jpg",
        price: 197876,
        code: "2206"
    },
    // _____________________________Холодильные камеры_______________________________________
    {
        link: "camera_standard.html",
        title: "Холодильная камера Standard",
        desc: "Холодильные камеры сборно-разборные из сэндвич-панелей с утеплителем из пенополиуретана (ППУ/PUR) изготавливаются на автоматизированной высокотехнологичной линии «Hennecke» (Германия) непрерывным способом.",
        img: "/themes/images/products/camera/main/1.jpg",
        price: 312354,
        code: "2401"
    }, {
        link: "camera_professional.html",
        title: "Холодильная камера Professional",
        desc: "Холодильные камеры со стеклом предназначены для хранения и демонстрации цветочной продукции, напитков и других продуктов. Одно из главных достоинств холодильной камеры – сверхнизкое потребление электроэнергии, соответствующее классу А++.",
        img: "/themes/images/products/camera/main/2.jpg",
        price: 556110,
        code: "2402"
    }, {
        link: "camera_steklo.html",
        title: "Холодильная камера со стеклянным фронтом",
        desc: "Холодильные камеры со стеклянным фронтом широко используются как альтернатива традиционным холодильным витринам, горкам и шкафам. Полотно двери представляет собой 2-х камерный стеклопакет с закаленным внешним стеклом.",
        img: "/themes/images/products/camera/main/3.jpg",
        price: 234155,
        code: "2403"
    }, {
        link: "camera_minicella.html",
        title: "Холодильная камера Minicella",
        desc: "Холодильные камеры - камера, имеющая достаточно большой внутренний объем – около 1500 литров при минимально занимаемой площади помещения. Камеры холодильные Minicella являются идеальным решением в сфере общественного питания и кейтеринга. Холодильные камеры поставляются в комплекте с холодильными машинами. Их можно без труда разобрать и перенести в другое нужное для использования помещение.",
        img: "/themes/images/products/camera/list/4.jpg",
        price: 752580,
        code: "2404"
    },
    // _____________________________________Холодильные установки____________________________________________
    {
        link: "monoblok_standard.html",
        title: "Моноблоки Standard",
        desc: "Моноблоки – холодильные машины среднетемпературные (тип ММ) и низкотемпературные (тип МВ). Моноблоки Standard предназначены для работы при температуре окружающего воздуха от +5°С до +40°С и относительной влажности не выше 80%.﻿ Моноблоки Standard заправлены хладагентом, протестированы на заводе и полностью готовы к эксплуатации.",
        img: "/themes/images/products/machine/main/2.jpg",
        price: 319572,
        code: "2501"
    }, {
        link: "monoblok_mmn.html",
        title: "Моноблоки MMN и LMN",
        desc: "Холодильные машины среднетемпературные (тип ММ) и низкотемпературные (тип МВ). Моноблоки Standard предназначены для работы при температуре окружающего воздуха от +5°С до +40°С и относительной влажности не выше 80%.﻿ Моноблоки Standard заправлены хладагентом, протестированы на заводе и полностью готовы к эксплуатации.",
        img: "/themes/images/products/machine/list/3.jpg",
        price: 324095,
        code: "2502"
    }, {
        link: "monoblok_mikrokanal.html",
        title: "Моноблоки с микроканальным конденсатором",
        desc: "Моноблоки серии R (ранцевого исполнения) - холодильные машины, как среднетемпературные, так и низкотемпературные, в отличие от серии Standard и MMN имеют микроканальный алюминиевый конденсатор.",
        img: "/themes/images/products/machine/main/1.jpg",
        price: 348596,
        code: "2503"
    }, {
        link: "monoblok_potolochnyi.html",
        title: "Моноблоки потолочные",
        desc: "Моноблоки предназначены для потолочного монтажа, что позволяет максимально использовать объем холодильной камеры. Конструкция моноблоков и их исполнение соответствует лучшим европейским образцам, отличается высоким качеством и привлекательным дизайном.",
        img: "/themes/images/products/machine/list/4.jpg",
        price: 325175,
        code: "2504"
    }, {
        link: "split_standard.html",
        title: "Сплит-системы Standard",
        desc: "Сплит-системы Standard - линия практичных коммерческих сплит-систем средне- и низкотемпературных. В сплит-системах Standard применяются герметичные поршневые компрессоры ведущих европейских производителей. В качестве дросселирующего устройства используется капиллярная трубка. Терморегулятор – электронный блок управления.",
        img: "/themes/images/products/machine/main/6.jpg",
        price: 352370,
        code: "2505"
    }, {
        link: "split_mikrokanal.html",
        title: "Сплит-системы с микроканальным конденсатором",
        desc: "Сплит-системы с микроканальными конденсаторными блоками – это среднетемпературные и низкотемпературные холодильные машины, которые в отличии от серии Standard и Professionale имеют микроканальный алюминиевый конденсатор.",
        img: "/themes/images/products/machine/main/7.jpg",
        price: 447108,
        code: "2506"
    }, {
        link: "split_professionale.html",
        title: "Сплит-системы Professionale",
        desc: "Сплит-системы Professionale – линия высокотехнологичных сплит-систем с муфтовыми соединениями выходов блоков и соединительных трубок, воздухоохладителем новой конструкции, выносным пультом управления в комплекте.",
        img: "/themes/images/products/machine/main/8.jpg",
        price: 618270,
        code: "2507"
    }, {
        link: "split_msn.html",
        title: "Сплит-системы MSN",
        desc: "Низкотемпературные сплит-системы MSN предназначены для поддержания необходимого температурного режима в морозильных камерах. Оборудование работает при температуре окружающей среды от 12 до 45 °С и относительной влажности воздуха не выше 80%",
        img: "/themes/images/products/machine/main/9.jpg",
        price: 618270,
        code: "2508"
    }
]




// _______________________Выводим цены на товарах и делаем динимический_______________________________
const span4 = document.querySelectorAll('.span4')

var formatter = function(priceSum) {
    let mn = 0;
    let price = priceSum.toString()
    for (let ij = price.length; ij > 0; ij--) {
        if (mn % 3 == 0) {
            price = [price.slice(0, ij), " ", price.slice(ij)].join('');
        }
        mn++;
    }
    return price;
}

// if (span4 != null) {
//     span4.forEach(function(t) {
//         let span4_p = t.querySelector('p');
//         let item = document.createElement('div');

//         if (span4_p != null) {
//             span4_p.parentNode.insertBefore(item, span4_p.nextSibling);

//             const t_href_main = t.querySelector('a')
//             if (t_href_main != null) {
//                 const t_href = t_href_main.getAttribute("href")

//                 data4.forEach(function(z) {

//                     if (t_href == z.link) {
//                         item.innerHTML = `
//                 <div class="container-price">
//                     <div class="price">${formatter(z.price)}<span>₸</span></div>
//                 </div>`
//                     }
//                 })
//             }
//         }
//     })
// }

// ___________
const span5_price_main = document.querySelector('.span5')

data4.forEach(function(z) {
    if (span5_price_main != null) {
        const span5_price = span5_price_main.querySelector('h3')
        if (span5_price != null) {
            var url_name = window.location.href.split('/').pop().split('#')[0].split('?')[0];
            if (url_name == z.link) {
                span5_price.innerHTML = `от ${formatter(z.price)} ₸`
            }
        }
    }
})

// ______________________________________________________________________________


{ /* <div class="search-price-container"><span class="search-price"> 399 490  ₸</span></div>*/ }


// const thumbnails_a = document.querySelectorAll("#blockView .thumbnails a")

// if (thumbnails_a != null) {
//     thumbnails_a.forEach(function(c) {
//         const pr_link_href = c.getAttribute("href")
//         const caption = c.querySelector(".caption")
//         let item_price = document.createElement('div');

//         if (caption != null) {
//             caption.parentNode.insertBefore(item_price, caption.nextSibling);
//         }
//         data4.forEach(function(d) {

//             if (pr_link_href == d.link) {
//                 item_price.innerHTML = `
//                     <div class="search-price-container">
//                         <span class="search-price">${formatter(d.price)} <span> ₸ </span> </span>
//                     </div>
//                     `
//             }
//         })
//     })
// }













let list = []
data4.forEach(function(a) {
    let list2 = a.title.split(" ")
    list2.forEach(function(b) {
        list.push(b)
    })
})



document.querySelector(".search-btn").addEventListener("click", function(e) {
    let reversed = false;

    let info = document.querySelector('#txtSearch').value


    var patterns = info.split(" ");
    console.log(patterns);

    var fields = { title: true, code: true, };
    let searchedWord = document.querySelector('#txtSearch').value
    if (localStorage.getItem("searched-word") === null) {
        localStorage.setItem("searched-word", JSON.stringify(searchedWord));
    } else {
        localStorage.removeItem('searched-word');
        localStorage.setItem("searched-word", JSON.stringify(searchedWord));
    }

    startSearch()

    function startSearch() {

        var results = smartSearch(data4, patterns, fields);
        // console.log(patterns);
        // console.log(results);
        // results.forEach(function(result) {
        //     console.log(result.entry);



        let sorted = []
        results.filter(function(a) {
            if (a.score < 2) {
                sorted.push(a.entry)
                return a.entry;
            }
        })




        // console.log(searchArray);


        document.querySelector('#txtSearch').value = ``


        if (localStorage.getItem("searched-cards") === null) {
            localStorage.setItem("searched-cards", JSON.stringify(sorted));
        } else {
            localStorage.removeItem('searched-cards');
            localStorage.setItem("searched-cards", JSON.stringify(sorted));
        }




        var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
        if (sorted.length > 0) {
            window.location.href = "search.html"
        } else {
            if (reversed == false) {
                patterns.reverse()
                reversed = true;
                if (didYouMean(patterns[patterns.length - 1], list) != null) {
                    patterns = didYouMean(patterns[patterns.length - 1], list)
                        // startSearch()

                    startSearch()
                } else {


                    let patternsLastEl = patterns.length - 1
                    let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                    patterns.pop()
                    if (newLastElement.length != 0) {
                        patterns.push(newLastElement)
                    }


                    // console.log(newLastElement);
                    // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                    // errorMsg()
                    // if (patterns[patternsLastEl].length != 0) {
                    startSearch()
                        // } else {
                        // errorMsg()
                        // }

                }
            } else {
                patterns.reverse()
                reversed = false;
                if (didYouMean(patterns[patterns.length - 1], list) != null) {
                    patterns = didYouMean(patterns[patterns.length - 1], list)
                        // startSearch()

                    startSearch()
                } else {


                    let patternsLastEl = patterns.length - 1
                    let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                    patterns.pop()
                    if (newLastElement.length != 0) {
                        patterns.push(newLastElement)
                    }


                    // console.log(newLastElement);
                    // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                    // errorMsg()
                    // if (patterns[patternsLastEl].length != 0) {
                    startSearch()
                        // } else {
                        // errorMsg()
                        // }
                }
            }
        }




    }


})

document.querySelector('#txtSearch').addEventListener('keypress', function(e) {
    let reversed = false;
    if (e.key === 'Enter') {
        let info = document.querySelector('#txtSearch').value


        var patterns = info.split(" ");
        console.log(patterns);

        var fields = { title: true, code: true, };
        let searchedWord = document.querySelector('#txtSearch').value
        if (localStorage.getItem("searched-word") === null) {
            localStorage.setItem("searched-word", JSON.stringify(searchedWord));
        } else {
            localStorage.removeItem('searched-word');
            localStorage.setItem("searched-word", JSON.stringify(searchedWord));
        }

        startSearch()

        function startSearch() {

            var results = smartSearch(data4, patterns, fields);
            // console.log(patterns);
            // console.log(results);
            // results.forEach(function(result) {
            //     console.log(result.entry);



            let sorted = []
            results.filter(function(a) {
                if (a.score < 2) {
                    sorted.push(a.entry)
                    return a.entry;
                }
            })


            // console.log(searchArray);


            document.querySelector('#txtSearch').value = ``


            if (localStorage.getItem("searched-cards") === null) {
                localStorage.setItem("searched-cards", JSON.stringify(sorted));
            } else {
                localStorage.removeItem('searched-cards');
                localStorage.setItem("searched-cards", JSON.stringify(sorted));
            }




            var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
            if (sorted.length > 0) {
                window.location.href = "search.html"
            } else {
                if (reversed == false) {
                    patterns.reverse()
                    reversed = true;
                    if (didYouMean(patterns[patterns.length - 1], list) != null) {
                        patterns = didYouMean(patterns[patterns.length - 1], list)
                            // startSearch()

                        startSearch()
                    } else {


                        let patternsLastEl = patterns.length - 1
                        let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                        patterns.pop()
                        if (newLastElement.length != 0) {
                            patterns.push(newLastElement)
                        }


                        // console.log(newLastElement);
                        // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                        // errorMsg()
                        // if (patterns[patternsLastEl].length != 0) {
                        startSearch()
                            // } else {
                            // errorMsg()
                            // }

                    }
                } else {
                    patterns.reverse()
                    reversed = false;
                    if (didYouMean(patterns[patterns.length - 1], list) != null) {
                        patterns = didYouMean(patterns[patterns.length - 1], list)
                            // startSearch()

                        startSearch()
                    } else {


                        let patternsLastEl = patterns.length - 1
                        let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                        patterns.pop()
                        if (newLastElement.length != 0) {
                            patterns.push(newLastElement)
                        }


                        // console.log(newLastElement);
                        // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                        // errorMsg()
                        // if (patterns[patternsLastEl].length != 0) {
                        startSearch()
                            // } else {
                            // errorMsg()
                            // }
                    }
                }
            }
        }
    }
});





document.querySelector(".search-btn2").addEventListener("click", function(e) {
    let reversed = false;

    let info = document.querySelector('#txtSearch2').value


    var patterns = info.split(" ");
    console.log(patterns);

    var fields = { title: true, code: true, };
    let searchedWord = document.querySelector('#txtSearch2').value
    if (localStorage.getItem("searched-word") === null) {
        localStorage.setItem("searched-word", JSON.stringify(searchedWord));
    } else {
        localStorage.removeItem('searched-word');
        localStorage.setItem("searched-word", JSON.stringify(searchedWord));
    }

    startSearch()

    function startSearch() {

        var results = smartSearch(data4, patterns, fields);
        // console.log(patterns);
        // console.log(results);
        // results.forEach(function(result) {
        //     console.log(result.entry);



        let sorted = []
        results.filter(function(a) {
            if (a.score < 2) {
                sorted.push(a.entry)
                return a.entry;
            }
        })




        // console.log(searchArray);


        document.querySelector('#txtSearch').value = ``


        if (localStorage.getItem("searched-cards") === null) {
            localStorage.setItem("searched-cards", JSON.stringify(sorted));
        } else {
            localStorage.removeItem('searched-cards');
            localStorage.setItem("searched-cards", JSON.stringify(sorted));
        }




        var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
        if (sorted.length > 0) {
            window.location.href = "search.html"
        } else {
            if (reversed == false) {
                patterns.reverse()
                reversed = true;
                if (didYouMean(patterns[patterns.length - 1], list) != null) {
                    patterns = didYouMean(patterns[patterns.length - 1], list)
                        // startSearch()

                    startSearch()
                } else {


                    let patternsLastEl = patterns.length - 1
                    let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                    patterns.pop()
                    if (newLastElement.length != 0) {
                        patterns.push(newLastElement)
                    }


                    // console.log(newLastElement);
                    // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                    // errorMsg()
                    // if (patterns[patternsLastEl].length != 0) {
                    startSearch()
                        // } else {
                        // errorMsg()
                        // }

                }
            } else {
                patterns.reverse()
                reversed = false;
                if (didYouMean(patterns[patterns.length - 1], list) != null) {
                    patterns = didYouMean(patterns[patterns.length - 1], list)
                        // startSearch()

                    startSearch()
                } else {


                    let patternsLastEl = patterns.length - 1
                    let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                    patterns.pop()
                    if (newLastElement.length != 0) {
                        patterns.push(newLastElement)
                    }


                    // console.log(newLastElement);
                    // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                    // errorMsg()
                    // if (patterns[patternsLastEl].length != 0) {
                    startSearch()
                        // } else {
                        // errorMsg()
                        // }
                }
            }
        }




    }



})

document.querySelector('#txtSearch2').addEventListener('keypress', function(e) {
    let reversed = false;
    if (e.key === 'Enter') {
        let info = document.querySelector('#txtSearch2').value


        var patterns = info.split(" ");
        console.log(patterns);

        var fields = { title: true, code: true, };
        let searchedWord = document.querySelector('#txtSearch2').value
        if (localStorage.getItem("searched-word") === null) {
            localStorage.setItem("searched-word", JSON.stringify(searchedWord));
        } else {
            localStorage.removeItem('searched-word');
            localStorage.setItem("searched-word", JSON.stringify(searchedWord));
        }

        startSearch()

        function startSearch() {

            var results = smartSearch(data4, patterns, fields);
            // console.log(patterns);
            // console.log(results);
            // results.forEach(function(result) {
            //     console.log(result.entry);



            let sorted = []
            results.filter(function(a) {
                if (a.score < 2) {
                    sorted.push(a.entry)
                    return a.entry;
                }
            })




            // console.log(searchArray);


            document.querySelector('#txtSearch').value = ``


            if (localStorage.getItem("searched-cards") === null) {
                localStorage.setItem("searched-cards", JSON.stringify(sorted));
            } else {
                localStorage.removeItem('searched-cards');
                localStorage.setItem("searched-cards", JSON.stringify(sorted));
            }




            var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
            if (sorted.length > 0) {
                window.location.href = "search.html"
            } else {
                if (reversed == false) {
                    patterns.reverse()
                    reversed = true;
                    if (didYouMean(patterns[patterns.length - 1], list) != null) {
                        patterns = didYouMean(patterns[patterns.length - 1], list)
                            // startSearch()

                        startSearch()
                    } else {


                        let patternsLastEl = patterns.length - 1
                        let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                        patterns.pop()
                        if (newLastElement.length != 0) {
                            patterns.push(newLastElement)
                        }


                        // console.log(newLastElement);
                        // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                        // errorMsg()
                        // if (patterns[patternsLastEl].length != 0) {
                        startSearch()
                            // } else {
                            // errorMsg()
                            // }

                    }
                } else {
                    patterns.reverse()
                    reversed = false;
                    if (didYouMean(patterns[patterns.length - 1], list) != null) {
                        patterns = didYouMean(patterns[patterns.length - 1], list)
                            // startSearch()

                        startSearch()
                    } else {


                        let patternsLastEl = patterns.length - 1
                        let newLastElement = patterns[patternsLastEl].slice(0, patterns[patternsLastEl].length - 1)
                        patterns.pop()
                        if (newLastElement.length != 0) {
                            patterns.push(newLastElement)
                        }


                        // console.log(newLastElement);
                        // patterns[patterns.length-1.slice(0, patterns[patterns.length].length - 1)]

                        // errorMsg()
                        // if (patterns[patternsLastEl].length != 0) {
                        startSearch()
                            // } else {
                            // errorMsg()
                            // }
                    }
                }
            }




        }
    }
});


function errorMsg() {
    iziToast.warning({ title: '', message: 'По такому запросу продуктов не найдено' });
}

// settings関数で初期設定 全体に適応させたい場合
// iziToast.settings({
//     timeout: 3000, // default timeout
//     resetOnHover: true,
//     // icon: '', // icon class
//     transitionIn: 'flipInX',
//     transitionOut: 'flipOutX',
//     position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
//     onOpen: function() {
//         // console.log('callback abriu!');
//     },
//     onClose: function() {
//         // console.log("callback fechou!");
//     }
// });