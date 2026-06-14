import { PropsWithChildren } from 'react'
import {
  AnimatedProp,
  HeightBudgetProvider,
  HeightClaim,
} from '@the-sheet/the-sheet'

type Props = PropsWithChildren & {
  type: 'provider' | 'claim'
  maxHeight?: AnimatedProp<number>
}

export const HeightBudgetConditional = ({
  type,
  maxHeight,
  children,
}: Props) => {
  if (!maxHeight || !children) {
    return children
  }

  if (type === 'provider') {
    return (
      <HeightBudgetProvider maxHeight={maxHeight}>
        {children}
      </HeightBudgetProvider>
    )
  }

  return <HeightClaim>{children}</HeightClaim>
}
