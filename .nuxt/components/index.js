export { default as AnswerWaitPost } from '../../components/AnswerWaitPost.vue'
export { default as AnswerWaitReply } from '../../components/AnswerWaitReply.vue'
export { default as FilteredPost } from '../../components/FilteredPost.vue'
export { default as NewPost } from '../../components/NewPost.vue'
export { default as SharedSendSentence } from '../../components/shared/SendSentence.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
