import jest from 'jest'
import enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import nestedShallow from './Test/Utils/nestedShallow'
import { render } from '@testing-library/react'

global.enzyme = enzyme
global.shallow = nestedShallow
global.render = render
global.mount = enzyme.mount

enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true,
})

let log, error, warn
beforeAll(() => {
  // log = console.log
  warn = console.warn
  // error = console.error
  // global.console.log = () => {}
  global.console.warn = () => {}
  // global.console.error = () => {}

})

afterAll(() => {
  // global.console.log = log
  global.console.warn = warn
  // global.console.error = error
})
