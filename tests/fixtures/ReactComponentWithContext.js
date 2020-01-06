import React from 'react'

export const TestContext = React.createContext('testing')

export class ContextReader extends React.Component {
  static contextType = TestContext
  render () {
    return <TestContext.Consumer>{value => <span>{value}</span>}</TestContext.Consumer>
  }
}
