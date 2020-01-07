import React from 'react'
import ReactDOM from 'react-dom'
import Vue from 'vue'
import ReactWrapper from './React'
import Context from '../Context'

const VUE_COMPONENT_NAME = 'vuera-internal-component-name'

export default class VueContainer extends React.Component {
  static contextType = Context
  constructor (props) {
    super(props)

    /**
     * We have to track the current Vue component so that we can reliably catch updates to the
     * `component` prop.
     */
    this.currentVueComponent = props.component
    this.slot = document.createElement('div')

    /**
     * Modify createVueInstance function to pass this binding correctly. Doing this in the
     * constructor to avoid instantiating functions in render.
     */
    const createVueInstance = this.createVueInstance
    const self = this
    this.createVueInstance = function (element, component, prevComponent) {
      createVueInstance(element, self, component, prevComponent)
    }
  }

  componentWillUnmount () {
    this.vueInstance.$destroy()
  }

  /* eslint-disable camelcase */
  UNSAFE_componentWillReceiveProps (nextProps) {
    /* eslint-enable */
    const { component, ...props } = nextProps

    if (this.currentVueComponent !== component) {
      this.updateVueComponent(this.props.component, component)
    }
    /**
     * NOTE: we're not comparing this.props and nextProps here, because I didn't want to write a
     * function for deep object comparison. I don't know if this hurts performance a lot, maybe
     * we do need to compare those objects.
     */
    Object.assign(this.vueInstance.$data, props)
  }

  /**
   * Creates and mounts the Vue instance.
   * NOTE: since we need to access the current instance of VueContainer, as well as the Vue instance
   * inside of the Vue constructor, we cannot bind this function to VueContainer, and we need to
   * pass VueContainer's binding explicitly.
   * @param {HTMLElement} targetElement - element to attach the Vue instance to
   * @param {React.Component} reactThisBinding - current instance of VueContainer
   */
  createVueInstance (targetElement, reactThisBinding) {
    if (targetElement === null) {
      return
    }

    const { component, on, ...props } = reactThisBinding.props

    // `this` refers to Vue instance in the constructor
    reactThisBinding.vueInstance = new Vue({
      el: targetElement,
      data: props,
      provide () {
        return {
          _vueraContext: reactThisBinding.context,
        }
      },
      render (createElement) {
        return createElement(
          VUE_COMPONENT_NAME,
          {
            props: this.$data,
            on,
          },
          reactThisBinding.slot
        )
      },
      components: {
        [VUE_COMPONENT_NAME]: component,
        'vuera-internal-react-wrapper': ReactWrapper,
      },
    })
  }

  updateVueComponent (prevComponent, nextComponent) {
    this.currentVueComponent = nextComponent

    /**
     * Replace the component in the Vue instance and update it.
     */
    this.vueInstance.$options.components[VUE_COMPONENT_NAME] = nextComponent
    this.vueInstance.$forceUpdate()
  }

  render () {
    if (this.props.children) {
      ReactDOM.createPortal(this.props.children, this.slot)
    }
    return <div ref={this.createVueInstance} />
  }
}
