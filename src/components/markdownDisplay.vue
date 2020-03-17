<template>
  <div v-html="processedMarkdown"></div>
</template>

<script>
  import marked from 'marked'
  import hljs from 'highlight.js'
  export default {
    name: "markdownDisplay",
    computed: {
      processedMarkdown() {
        return marked(this.markdown, {
          highlight(md) {
            return hljs.highlightAuto(md).value;
          }
        });
      }
    },
    props: ['markdown']
  }
</script>

<style scoped>

</style>
