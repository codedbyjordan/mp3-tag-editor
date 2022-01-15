<script lang="ts">
  import arrayFromRange from "./lib/arrayFromRange";
  // @ts-ignore
  import DirectoryContents from "./lib/DirectoryContents.svelte";
  import { dir } from "./lib/stores/dir";
  import { currentTrack, emptyTrack } from "./lib/stores/track";
  import Toolbar from "./lib/Toolbar.svelte";
  import { genres } from "./lib/types";
  // @ts-ignore
  window.api.on("dir-opened", (openedDir) => {
    $dir.mp3Files = openedDir.contents;
    $dir.name = openedDir.name;
  });

  const createImageFromBuffer = (imageBuffer: Uint8Array | string): string => {
    return URL.createObjectURL(new Blob([imageBuffer]));
  };

  const handleFileDrag = (e): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileDrop = (e): void => {
    e.preventDefault();
    e.stopPropagation();
    Object.values(e.dataTransfer.files).map((file: { path: string }) => {
      if (
        file.path.endsWith("jpeg") ||
        file.path.endsWith("jpg") ||
        file.path.endsWith("png")
      ) {
        // @ts-ignore
        $currentTrack.tags.APIC = window.api.getFileBuffer(file.path);
      }
    });
  };

  const updateTrackNumber = (e) => {
    Object.values(e.target).map((optionElement) => {
      if (
        optionElement instanceof HTMLOptionElement &&
        optionElement.selected
      ) {
        $currentTrack.tags.trackNumber = optionElement.innerText;
      }
    });
  };
</script>

<main class="h-screen">
  <Toolbar />
  <div class="flex">
    <form action="#" class="flex flex-col bg-[#F0F0F0] p-4 h-full">
      <p class="font-bold">{$currentTrack.name || "No track selected"}</p>
      <p class="mt-4">Title:</p>
      <input
        type="text"
        name="title"
        bind:value={$currentTrack.tags.title}
        class="border-[#E1E1E1] border-2 pl-2"
      />
      <p class="mt-4">Artist:</p>
      <input
        type="text"
        name="artist"
        bind:value={$currentTrack.tags.artist}
        class="border-[#E1E1E1] border-2 pl-2"
      />
      <p class="mt-4">Album:</p>
      <input
        type="text"
        name="album"
        bind:value={$currentTrack.tags.album}
        class="border-[#E1E1E1] border-2 pl-2"
      />
      <div class="grid grid-flow-col grid-col-5 mt-4 gap-2">
        <div>
          <p>Year:</p>
          <select
            name="year"
            bind:value={$currentTrack.tags.year}
            class="border-[#E1E1E1] border-2 w-full"
          >
            <optgroup label="Year">
              <option selected value={$currentTrack.tags.year}
                >{$currentTrack.tags.year}</option
              >
              {#each arrayFromRange(1900, new Date().getFullYear()).reverse() as year}
                <option value={year}>{year}</option>
              {/each}
            </optgroup>
          </select>
        </div>

        <div>
          <p>Track:</p>
          <select
            name="trackNumber"
            class="border-[#E1E1E1] border-2 w-full"
            on:change={(e) => {
              updateTrackNumber(e);
            }}
          >
            <option value="">N/A</option>
            {#each arrayFromRange(1, $currentTrack.tags.totalTracks) as trackNum}
              <option
                value="{trackNum}/{$currentTrack.tags.totalTracks}"
                selected={trackNum == $currentTrack.tags.trackNum}
                >{trackNum}/{$currentTrack.tags.totalTracks}</option
              >
            {/each}
          </select>
        </div>
        <div>
          <p>Genre:</p>
          <select name="genre" class="border-[#E1E1E1] border-2 w-full">
            {#if !genres.includes($currentTrack.tags.genre)}
              <option value={$currentTrack.tags.genre} selected
                >{$currentTrack.tags.genre}</option
              >
            {/if}
            {#each genres as genre}
              <option value={genre} selected={genre == $currentTrack.tags.genre}
                >{genre}</option
              >
            {/each}
          </select>
        </div>
      </div>

      <p class="mt-4">Comment:</p>
      <input
        type="text"
        name="comment"
        bind:value={$currentTrack.tags.comment.text}
        class="border-[#E1E1E1] border-2 pl-2"
      />

      <div
        class="w-72 h-72 2xl:w-96 2xl:h-96 border-2 border-black mt-8"
        on:dragover={handleFileDrag}
        on:drop={handleFileDrop}
      >
        {#if $currentTrack.tags.APIC}
          <img
            src={createImageFromBuffer($currentTrack.tags.APIC)}
            alt="Album Cover"
            width="384"
            height="384"
          />
        {/if}
      </div>
    </form>
    <DirectoryContents />
  </div>
</main>
