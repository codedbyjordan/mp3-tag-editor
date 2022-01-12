<script lang="ts">
  import { currentTrack } from "./stores/track";
  import { dir } from "./stores/dir";
  export let filename;
</script>

<p
  on:click={(e) => {
    // @ts-ignore
    let file = window.api.openFile($dir.name, e.target.innerText);
    file.tags.APIC = file.tags.APIC;
    currentTrack.set({ name: file.name, tags: file.tags });
  }}
  class="hover:cursor-pointer pt-2"
>
  {filename}
</p>
