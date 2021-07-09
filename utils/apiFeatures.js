// class ///////////////////////////
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1) Filtering/////////////////////////////////////////////
    const queryObj = { ...this.queryString }; // structuring
    const excludedFeilds = ['page', 'limit', 'sort', 'fields'];
    excludedFeilds.forEach((el) => {
      delete queryObj[el];
    });

    //2) Advanced Filtering////////////////////////////////////
    let queryStr = JSON.stringify(queryObj);
    /*
        /\b gte|gt|lte|lt\b/g  ==> this chekes for four words in the qurey
      */
    queryStr = queryStr.replace(/\b gte|gt|lte|lt \b/g, (match) => `$${match}`);
    //console.log(JSON.parse(queryStr));

    //method : 1
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      //console.log(sortBy);
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      //console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paging() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    // if (this.queryString.page) {
    //   const tourCount = await Tour.countDocuments();
    //   //console.log(tourCount, skip);
    //   if (skip >= tourCount) throw new Error('This page not found');
    return this;
  }
}
module.exports = ApiFeatures;
