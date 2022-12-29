function removeUndefinedEntries(object) {
  return Object.entries(object).reduce((prev, [key, value]) => {
    if (typeof value === 'undefined') {
      return prev;
    }

    return { ...prev, [key]: value };
  }, {})
}

module.exports = { removeUndefinedEntries };
