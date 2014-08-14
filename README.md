catalogue-hooks
===============

jQuery hooks for Innovative catalogue

### itemInfo.js ###
itemInfo.js provides access to the core item information (library/location, library/location URL, classmark, classmark URL, availability) to items both in full record display and to each item in each row of BriefCit.

The make up of the item object created by itemInfo is:

classM: "", classMURL: "", library: "", libraryURL: "", status: ""

For example, in BriefCit mode, you can access this by using:

RowArr[0][0].classM

This will return the classmark of the first item in the first row.

For use in full record you can access the elements by:

itemObj[0].classM

This will return the classmark for the first item in the display.
