<script lang="ts">
  import Fa from "svelte-fa";
  import { faSave, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
  import { currentTrack } from "./stores/track";
  import { dir } from "./stores/dir";

  const saveTrack = () => {
    // @ts-ignore
    window.api.saveTrack(
      `${$dir.name}/${$currentTrack.name}`,
      $currentTrack.tags
    );
  };
</script>

<div class="flex pl-4 p-2 shadow-md">
  <button on:click={saveTrack}
    ><Fa icon={faSave} size="lg" class="px-[6px]" /></button
  >
  <button on:click={window.api.openDir}
    ><Fa icon={faFolderOpen} size="lg" class="px-[6px]" /></button
  >
</div>
