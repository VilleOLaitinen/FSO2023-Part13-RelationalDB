
const { Blog } = require('../models')


const blogqueryhelper = (read) => {
 let x = {
    model: Blog,
    as: 'readings',
    attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
    through: {
      attributes: ['id', 'read'], where: { read: false }
    },
  }

  let y = {
    model: Blog,
    as: 'readings',
    attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
    through: {
      attributes: ['id', 'read'], where: { read: true }
    },
  }

  let z = {
    model: Blog,
    as: 'readings',
    attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
    through: {
      attributes: ['id', 'read'],
    },
  }

  if(read === 'true') {
    return y
  } else if (read === 'false') {
    return x
  } else {
    return z
  }

}

module.exports = blogqueryhelper