const SearchParameters = require('../../classes/search');
const searchParameters = require('../../classes/search');

describe('Tests for tutor search functionality', () => {
  it('should create a query that includes users who are tutors', () => {
    const parameters = {};
    const searchParameters = new SearchParameters(parameters);
    const query = searchParameters.createQuery();

    expect(query).toEqual({isTutor: true});
  });

  it('should properly pass a username to the search parameters', () => {
    const parameters = {username: 'Brody'};
    const searchParameters = new SearchParameters(parameters);
    const query = searchParameters.createQuery();

    expect(query).toEqual({
      isTutor: true,
      username: { $regex: 'Brody', $options: 'i'},
    })
  });

  it('should build a multi-parameter query', () => {
    const params = {
      username: 'Brody',
      major: 'Cybersecurity',
      rating: '4',
      hasReviews: 'on',
      schoolYear: 'Junior',
      availability: ['Monday', 'Wednesday', 'Friday'],
    }
  });

  it('should create a query with only one availability value', () => {
    const parameters = {
      availability: 'Saturday',
    };

    const searchParameters = new SearchParameters(parameters);
    const query = searchParameters.createQuery();

    expect(query).toEqual({
      isTutor: true,
      'availability.day': {$in: ['Saturday']},
    })
  });

  it('should create a query with no reviews', () => {
    const parameters = {
      hasReviews: 'off',
    };

    const searchParameters = new SearchParameters(parameters);
    const query = searchParameters.createQuery();
    
    expect(query).toEqual({
      isTutor: true,
    });
  })

  it('should create a query with all parameters empty', () => {
    const parameters = {};
    const searchParameters = new SearchParameters(parameters);
    const query = searchParameters.createQuery();

    expect(query).toEqual( {
      isTutor: true,
    })
  })
});