'use strict';

// create an array to hold the item objects
var itemObj = [];

// set the locations served
var itmLoc = [];

var rowArr = [];

// check the length e.g. if there is content of div etc.
function lenChk(term) {
    var lenRsp;
    if (term.length > 0) {
        lenRsp = true;
    } else {
        lenRsp = false;
    }
    return lenRsp;
}

/*
 * Item Object and its properties
 * classM = classmark
 * library = owning library
 * status = the item's current availability
 * classMURL = the url in the href of classmark
 * libraryURL = the url in the href of library
 */
function ItemObj(classM, library, status, classMURL, libraryURL) {
    this.classM = classM;
    this.library = library;
    this.status = status;
    this.classMURL = classMURL;
    this.libraryURL = libraryURL;
}

/*
 * removing whitespace at beginning and end of string as trim() isn't compatible with IE prior to 9:
 * http://stackoverflow.com/questions/3000649/trim-spaces-from-start-and-end-of-string
 */
function trim11(str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}

/*
 * get information about the items - the Library, Classmark, the format (taken from the LEADER), availability, URL etc.
 * create the item objects and push them to the itemObj array
 *
 */
function itemInfo() {

    // define variables
    var library, library_html, classMark, classMark_html, avail, html, item, i;

    if (lenChk($('div .bibMedia')) === true) {
        var tableRow = $(' .bibItemsEntry');

        // loop through every table row under the bibItems class this will put all items in the table into an array
        for (i = 0; i < tableRow.length; i++) {

            // we have a nbsp preceeding our Library location, so we need to remove this nbsp before we can use the location.
            library = $(tableRow[i]).children("td:nth-child(1)");

            // take the html in the row as the default location URL and text
            library_html = $(library).find('a').attr('href');

            // get the library and remove unnecessary whitespace
            library = trim11($(library).text());

            // get the second child (ie second cell) of the row with the class bibItemsEntry as this contains our classmark
            classMark_html = $(item[i]).children("td:nth-child(2)").find('a').attr('href');
            classMark = trim11($(tableRow[i]).children("td:nth-child(2)").text());

            avail = trim11($(tableRow[i]).children("td:nth-child(3)").text());

            // create new objects
            itemObj.push(new ItemObj(classMark, library, avail, classMark_html, library_html));
        }


    }
    if (lenChk($('div .briefcitMedia')) === true) {
        // create array structure of rowArr[titleArr[itemArr[ItemObj],itemArr[ItemObj]]]
        $('div .briefcitRow').each(function(index) {
            item = $(this).find(' .bibItemsEntry');
            var rowInd = index;
            var titleArr = [];
            for (i = 0; i < item.length; i++) {
                var itemArr = [];
                library = $(item[i]).children("td:nth-child(1)");
                library_html = $(library).find('a').attr('href');
                //library_html = $(library_html[href]);
                library = trim11($(library).text());
                html = $(item[i]).html();
                classMark_html = $(item[i]).children("td:nth-child(2)").find('a').attr('href');
                //classMark_html = $(classMark_html[href]);
                classMark = trim11($(item[i]).children("td:nth-child(2)").text());
                avail = trim11($(item[i]).children("td:nth-child(3)").text());
                titleArr.push(new ItemObj(classMark, library, avail, classMark_html, library_html));
            }

            rowArr.push(titleArr);
            return rowArr;
        });

    }
}