const duplicateValidator = () => ({
  validator: (value)  => {
    return value.length === new Set(value).size
  },
  message: props => `${props.value} contains duplicate values!`
})

module.exports = duplicateValidator