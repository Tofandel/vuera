import React from 'react'

export const TestContext = React.createContext('')

export class ContextReader extends React.Component {
  static contextType = TestContext
  render () {
    return <span>{this.context}</span>
  }
}
