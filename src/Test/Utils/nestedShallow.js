import enzyme from 'enzyme'
import _times from 'lodash/times'

const diveToLevel = (wrapper, autoNesting, nestingLevel) => {
  let nestedWrapper = wrapper

  if (autoNesting) {
    nestedWrapper = nestedWrapper.childAt(0)
  }

  _times(nestingLevel, () => {
    nestedWrapper = nestedWrapper.childAt(0)
  })

  return nestedWrapper
}


const nestedShallow = (node, options = {}) => {
  const { autoNesting = false, nestingLevel, ...rest } = options

  return diveToLevel(enzyme.shallow(node), autoNesting, nestingLevel)
}

export default nestedShallow;
