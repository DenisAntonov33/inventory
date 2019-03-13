exports.res = {
  success: function(data) {
    return { status: 200, data };
  },

  error: function(status, message) {
    return { status, message };
  }
};
