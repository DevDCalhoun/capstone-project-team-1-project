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

    if(username) {
      query.username = { $regex: username, $options: 'i'};
    }
    if(major) {
      query.major = { $regex: major, $options: 'i'};
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
}

module.exports = SearchParameters;