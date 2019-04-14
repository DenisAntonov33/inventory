exports.normalize = data =>
  data.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
