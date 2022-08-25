
class SearchProduct{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ?{
            name:{
                $regex:`${this.queryStr.keyword}`,
                $options:'i'
            }
        }:{}

        this.query =this.query.find({...keyword});
        return this;
    }

    filter(){
        const copyStr = {...this.queryStr};
        console.log(this.queryStr);
        console.log(copyStr);

        // removing keywrods in array from query object
        const removeKeywords = ['keyword','limit','page']
        removeKeywords.forEach(ele=> delete copyStr[ele]);

        // stringify the object beacuse to apply replace method
        let newQueryStr = JSON.stringify(copyStr);
        // gte lte lt and gt are operators of mongodb 
        console.log(newQueryStr);
        newQueryStr =  newQueryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
        console.log(newQueryStr);

        this.query = this.query.find(JSON.parse(newQueryStr));

        return this;
    }
    pagination(resPerPage){
        // currentPage has currentPage number
        const currentPage = this.queryStr.page || 1;
        // skipItems skip items according to page number. if current page is 1 than it skips 0 items because we display 4 items per page and if current page is 2 then it skips 4 items because 1st page is displaying 4 items and we will not display them in second page.
        const skipItems = resPerPage *(currentPage - 1);

        // limit() gives the passed parameter number of items out of total and skip() skips the items.
        this.query = this.query.limit(resPerPage).skip(skipItems);
        return this;
    }
}

module.exports = SearchProduct;