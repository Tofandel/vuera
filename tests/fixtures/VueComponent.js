export default {
  props: ['message', 'reset'],
  render (createElement) {
    return createElement('div', [
      createElement('span', this.$slots.default),
      createElement(
        'button',
        {
          on: {
            click: this.reset,
          },
        },
        this.message
      ),
    ])
  },
}
