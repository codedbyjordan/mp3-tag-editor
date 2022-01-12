<script>
  import { dir } from "./stores/dir";
  import Mp3File from "./Mp3File.svelte";
</script>

<div class="w-full pl-4 pt-4">
  <h3 class="font-bold text-xl">{$dir.name}</h3>
  {#each $dir.mp3Files as mp3File}
    <Mp3File filename={mp3File} />
  {/each}
</div>
