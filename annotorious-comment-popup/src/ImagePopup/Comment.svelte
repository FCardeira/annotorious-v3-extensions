<script lang="ts">
  import autosize from 'svelte-autosize';
</script>

<div class="a9s-comment">
  <textarea use:autosize></textarea>
</div>

<style>
  textarea {
    border: 0;
    box-sizing: border-box;
    height: 100%;
    outline: none;
    resize: none;
    width: 100%;
  }
</style>

