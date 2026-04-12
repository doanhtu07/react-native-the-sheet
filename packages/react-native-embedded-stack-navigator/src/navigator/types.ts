import type { ReactElement } from 'react'

export type TransitionType = 'slide' | 'fade'

export type ScreenRenderer = () => ReactElement | null
