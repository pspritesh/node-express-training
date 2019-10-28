exports.importModel = (model) => {
  return require(`../models/Sequelize/${model}`)
}

exports.configRelations = () => {
  this.importModel('User').hasOne(this.importModel('Profile'))
  this.importModel('Profile').belongsTo(this.importModel('User'), {constraints: true, onDelete: 'CASCADE'})

  // Sequelize One-To-Many relationship
  // this.importModel('User').hasMany(this.importModel('Product'))
  // this.importModel('Product').belongsTo(this.importModel('User'), {constraints: true, onDelete: 'CASCADE'})

  // Sequelize Many-To-Many relationship
  this.importModel('User').belongsToMany(this.importModel('Product'), {through: this.importModel('UserProducts'), constraints: true, onDelete: 'CASCADE'})
  this.importModel('Product').belongsToMany(this.importModel('User'), {through: this.importModel('UserProducts'), constraints: true, onDelete: 'CASCADE'})
}
