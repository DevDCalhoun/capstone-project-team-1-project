class SearchParameters {
  constructor(params) {
    this.params = params;
  }

  createQuery() {
    const {
      username,
      major,
      rating,
      hasReviews,
      schoolYear,
      isTutor,
      availability,
    } = this.params;

    const query = {};

    query.isTutor = true;

    if(username) {
      const cleanUsername = this.checkText(username);
      query.username = { $regex: cleanUsername, $options: 'i'};
    }
    if(major) {
      const cleanMajor = this.checkText(major);
      query.major = { $regex: cleanMajor, $options: 'i' };
    }
    if(rating) {
      query.rating = {$gte: rating };
    }
    if(hasReviews === 'on') {
      query.reviews = { $exists: true, $not: { $size: 0 } };
    }
    if(schoolYear) {
      query.schoolYear = schoolYear;
    }
    if(availability) {
      const availabilityArray = Array.isArray(availability) ? availability : [availability];
      query['availability.day'] = { $in: availabilityArray };
    }

    return query;
  }

  checkText(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }
}

module.exports = SearchParameters;