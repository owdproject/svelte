/**
 * @owdproject/svelte
 * Official Svelte 4/5 store contract & pointer action adapter for @owdproject/core.
 */

import {
  createDesktop,
  DesktopPointerSession,
  type Desktop,
  type DesktopOptions,
  type DesktopSnapshot,
  type WindowInstance,
  type WindowState,
  type ResizeDirection,
} from '@owdproject/core'

export * from '@owdproject/core'

export interface ReadableDesktopStore<T> {
  subscribe: (run: (value: T) => void) => () => void
  getSnapshot: () => T
}

export function createDesktopStore(
  desktopOrOptions?: Desktop | DesktopOptions,
): ReadableDesktopStore<DesktopSnapshot> & { desktop: Desktop } {
  const desktop =
    desktopOrOptions && 'windows' in desktopOrOptions
      ? desktopOrOptions
      : createDesktop(desktopOrOptions)

  return {
    desktop,
    subscribe: (run) => desktop.subscribe(run),
    getSnapshot: () => desktop.getSnapshot(),
  }
}

export function createWindowStore(
  instance: WindowInstance,
): ReadableDesktopStore<WindowState> & { instance: WindowInstance } {
  return {
    instance,
    subscribe: (run) => instance.subscribe(run),
    getSnapshot: () => instance.getSnapshot(),
  }
}

export function createDesktopPointer(instance: WindowInstance, desktop?: Desktop) {
  return {
    onTitlebarPointerDown(event: PointerEvent) {
      desktop?.windows.focusWindow(instance.id)
      const state = instance.getSnapshot()
      const pos = state.position ?? { x: 0, y: 0 }
      const size = state.size ?? { width: 640, height: 480 }
      return DesktopPointerSession.startDrag(event, {
        initialBounds: {
          x: pos.x ?? 0,
          y: pos.y ?? 0,
          width: typeof size.width === 'number' ? size.width : 640,
          height: typeof size.height === 'number' ? size.height : 480,
        },
        workarea: desktop?.workspaces.workarea,
        onStart: () => instance.startDrag(),
        onMove: (bounds) => instance.setPosition({ x: bounds.x, y: bounds.y }),
        onEnd: (bounds, snapZone) => {
          instance.stopDrag()
          if (snapZone) {
            instance.setLayout(snapZone, desktop?.workspaces.workarea)
          } else {
            instance.setPosition({ x: bounds.x, y: bounds.y })
          }
        },
        onCancel: () => instance.stopDrag(),
      })
    },
    onResizePointerDown(event: PointerEvent, direction: ResizeDirection) {
      desktop?.windows.focusWindow(instance.id)
      const state = instance.getSnapshot()
      const pos = state.position ?? { x: 0, y: 0 }
      const size = state.size ?? { width: 640, height: 480 }
      return DesktopPointerSession.startResize(event, {
        direction,
        initialBounds: {
          x: pos.x ?? 0,
          y: pos.y ?? 0,
          width: typeof size.width === 'number' ? size.width : 640,
          height: typeof size.height === 'number' ? size.height : 480,
        },
        workarea: desktop?.workspaces.workarea,
        onStart: () => instance.startResize(),
        onMove: (bounds) => {
          instance.setPosition({ x: bounds.x, y: bounds.y })
          instance.setSize({ width: bounds.width, height: bounds.height })
        },
        onEnd: (bounds) => {
          instance.stopResize()
          instance.setPosition({ x: bounds.x, y: bounds.y })
          instance.setSize({ width: bounds.width, height: bounds.height })
        },
        onCancel: () => instance.stopResize(),
      })
    },
  }
}
