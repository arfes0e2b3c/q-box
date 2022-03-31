export const AnswerWaitPost = () => import('../../components/AnswerWaitPost.vue' /* webpackChunkName: "components/answer-wait-post" */).then(c => wrapFunctional(c.default || c))
export const AnswerWaitReply = () => import('../../components/AnswerWaitReply.vue' /* webpackChunkName: "components/answer-wait-reply" */).then(c => wrapFunctional(c.default || c))
export const FilteredPost = () => import('../../components/FilteredPost.vue' /* webpackChunkName: "components/filtered-post" */).then(c => wrapFunctional(c.default || c))
export const NewPost = () => import('../../components/NewPost.vue' /* webpackChunkName: "components/new-post" */).then(c => wrapFunctional(c.default || c))
export const SharedSendSentence = () => import('../../components/shared/SendSentence.vue' /* webpackChunkName: "components/shared-send-sentence" */).then(c => wrapFunctional(c.default || c))

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
