'use strict';

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
 *  library_id = the id to access the an item's library value
 *  classmark_id = the id to access the an item's classmark value
 *  avail_id = the id to access the an item's availability value
 */
function ItemObj(classM, library, status, classMURL, libraryURL,library_id, classmark_id, avail_id) {
    this.classM = classM;
    this.library = library;
    this.status = status;
    this.classMURL = classMURL;
    this.libraryURL = libraryURL;
    this.library_id = library_id;
    this.classmark_id = classmark_id;
    this.avail_id = avail_id;
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

    // create an array to hold the item objects
    var itemObj = [];

    // set the locations served
    var itmLoc = [];

    var rowArr = [];

    // define variables
    var library, library_html, classMark, classMark_html, avail, html, item, i;

    if (lenChk($('div .bibMedia')) === true) {
        var tableRow = $(' .bibItemsEntry');

        // loop through every table row under the bibItems class this will put all items in the table into an array
        for (i = 0; i < tableRow.length; i++) {
            var id = i + 1;
            // we have a nbsp preceeding our Library location, so we need to remove this nbsp before we can use the location.
            library = $(tableRow[i]).children("td:nth-child(1)");

            // take the html in the row as the default location URL and text
            library_html = $(library).html();

            // set the binding ids for making changes
            $(tableRow[i]).children("td:nth-child(1)").attr('id', 'itemInfo_'+id+'_lib');
            $(tableRow[i]).children("td:nth-child(2)").attr('id', 'itemInfo_'+id+'_class');
            $(tableRow[i]).children("td:nth-child(3)").attr('id', 'itemInfo_'+id+'_avail');

            var library_id = 'itemInfo_'+id+'_lib';
            var classmark_id = 'itemInfo_'+id+'_class';
            var avail_id = 'itemInfo_'+id+'_avail';

            // get the library and remove unnecessary whitespace
            library = trim11($(library).text());

            // get the second child (ie second cell) of the row with the class bibItemsEntry as this contains our classmark
            classMark_html = $(tableRow[i]).children("td:nth-child(2)").find('a').attr('href');
            classMark = trim11($(tableRow[i]).children("td:nth-child(2)").text());

            avail = trim11($(tableRow[i]).children("td:nth-child(3)").text());

            // create new objects
            itemObj.push(new ItemObj(classMark, library, avail, classMark_html, library_html, library_id, classmark_id, avail_id ));
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
                var id = i + 1;
                // set the binding ids for making changes
                $(item[i]).children("td:nth-child(1)").attr('id', 'itemInfo_'+id);
                $(item[i]).children("td:nth-child(2)").attr('id', 'itemInfo_'+id);
                $(item[i]).children("td:nth-child(3)").attr('id', 'itemInfo_'+id);

                var library_id = 'itemInfo_'+id+'_lib';
                var classmark_id = 'itemInfo_'+id+'_class';
                var avail_id = 'itemInfo_'+id+'_avail';

                library = $(item[i]).children("td:nth-child(1)");
                library_html = $(library).find('a').attr('href');
                library = trim11($(library).text());
                html = $(item[i]).html();
                classMark_html = $(item[i]).children("td:nth-child(2)").find('a').attr('href');
                classMark = trim11($(item[i]).children("td:nth-child(2)").text());
                avail = trim11($(item[i]).children("td:nth-child(3)").text());
                titleArr.push(new ItemObj(classMark, library, avail, classMark_html, library_html, library_id, classmark_id, avail_id));
            }

            rowArr.push(titleArr);
            return rowArr;
        });

    }
    return itemObj;
}

// Get more information about the bib item

function getMoreContent() {

// Get the rows from the bibDisplayContentMore table (e.g Subject, ISBN etc.)
var detail = $('div .bibDisplayContentMore > table.bibDetail > tbody > tr > td > table > tbody > tr');
var inf_array = [];

// Create object to hold labels (ie properties from More Content)
var idetail = {};

for(var i=0; i < detail.length; i++){

  var infoarr = $(detail[i]).children().toArray();
  var label, data = [];

  $.each(infoarr, function(key,value){
    if($(value).hasClass('bibInfoLabel') == true){
        label = trim11($(value).text());
      }
    if($(value).hasClass('bibInfoData') == true){
      if($(value).prev().hasClass('bibInfoLabel') == true){
          data.push(trim11($(value).text()));
        }
        else if($(value).prev().hasClass('bibInfoLabel') == false){

          var prev = key-1;
          var newD = trim11($(value).text());

          if(idetail[label].length == 0){

            var first = idetail[label][prev];
            data.push(first,newD);

          }
          else{

             idetail[label].push(newD);
             data = idetail[label];

          }
        }
        else if($(value).hasClass('bibInfoData') == false && $(value).hasClass('bibInfoData') == false){
          return true;
        }
      }
    });

    idetail[label] = data;

}
inf_array.push(idetail);

return inf_array;

}

var itemInf = itemInfo();
var moreContent = getMoreContent();