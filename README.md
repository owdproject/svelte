<div align="center">

  <h1>@owdproject/svelte</h1>

  <p>
    <strong>Official Svelte 4 & 5 Adapter for Open Web Desktop.</strong><br /><br />
    Native Svelte <code>Readable</code> store contracts (<code>$store</code>) and pointer<br />
    drag/resize actions powered by <code>@owdproject/core</code>.
  </p>

  <br />

  <p>
    <a href="https://npmjs.com/package/@owdproject/svelte"><img src="https://img.shields.io/npm/v/@owdproject/svelte/alpha.svg?style=flat&colorA=020420&colorB=00DC82" alt="npm version" /></a>
    <a href="https://svelte.dev"><img src="https://img.shields.io/badge/Svelte-020420?logo=svelte" alt="Svelte" /></a>
    <a href="https://github.com/owdproject/core/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-00DC82.svg?style=flat&colorA=020420&colorB=00DC82" alt="License" /></a>
  </p>

</div>

---

## Overview

`@owdproject/svelte` (`4.0.0-alpha.0`) wraps [`@owdproject/core`](https://npmjs.com/package/@owdproject/core) in standard Svelte `Readable` stores (`{ subscribe }`) and provides pre-wired pointer drag/resize helpers.

---

## Quick Start

```bash
pnpm add @owdproject/core@4.0.0-alpha.0 @owdproject/svelte@4.0.0-alpha.0
```

```html
<script lang="ts">
  import { createDesktopStore, createWindowStore, createDesktopPointer } from '@owdproject/svelte'

  const desktopStore = createDesktopStore()
</script>

<main>
  {#each $desktopStore.windows as win (win.id)}
    <div>{win.config.title}</div>
  {/each}
</main>
```

---

## Exported Store Factories

| Function | Description |
| :--- | :--- |
| **`createDesktopStore(instanceOrOptions?)`** | Returns a Svelte `Readable<DesktopSnapshot>` exposing `.desktop`. |
| **`createWindowManagerStore(manager?)`** | Returns a Svelte `Readable<WindowInstance[]>` exposing `.manager`. |
| **`createWindowStore(instance)`** | Returns a Svelte `Readable<WindowState>` exposing `.instance`. |
| **`createDesktopPointer(instance, desktop)`** | Returns `onTitlebarPointerDown` and `onResizePointerDown` handlers. |

---

## License

[MIT](https://opensource.org/licenses/MIT)
