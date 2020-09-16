const paginatedResults = (req,model) => {
    // Pagination 
   // Setting deafult value for variables if there is no req.query.page and limit 
    const page = typeof(req.query.page) != 'undefined' ? parseInt(req.query.page) : 1;
    const limit = typeof(req.query.limit) != 'undefined' ? parseInt(req.query.limit) : 5;
    
    // creating start index and endindex of posts
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    
    // Exporting everything in a result object
    const results = {}

    // Generating next post if model lengh is greter than current index
    if(endIndex < model.length) { 
    results.next = {
      page: page + 1,
      limit: limit
    }}
   
    // Generating last post if start index is greter then zero
    if(startIndex > 0) { 
    results.previous = {
      page: page - 1,
      limit: limit
    }}

    // Slicing the model giving it start and end index
    results.results = model.slice(startIndex,endIndex);
    
    return results;
  };

  exports.paginatedResults = paginatedResults;
