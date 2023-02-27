<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  middleware: "authenticated",
};
</script>
