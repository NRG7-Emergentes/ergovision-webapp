import { cva, VariantProps } from 'class-variance-authority';

export const containerProgressBarVariants = cva('w-full transition-all', {
  variants: {
    zType: {
      default: 'bg-primary/10 ',
      destructive: 'bg-destructive/10 ',
      accent: 'bg-primary/10 ',
      constructive : 'bg-green-500/10 '
    },
    zSize: {
      default: 'h-2',
      sm: 'h-3',
      lg: 'h-5',
    },
    zShape: {
      default: 'rounded-sm',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
    zIndeterminate: {
      true: 'relative',
    },
  },

  defaultVariants: {
    zType: 'default',
    zSize: 'default',
    zShape: 'default',
  },
});
export type ZardContainerProgressBarVariants = VariantProps<typeof containerProgressBarVariants>;

export const progressBarVariants = cva('h-full transition-all', {
  variants: {
    zType: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      accent: 'bg-chart-1',
      constructive: 'bg-green-500'
    },
    zShape: {
      default: 'rounded-sm',
      circle: 'rounded-full ',
      square: 'rounded-none',
    },
    zIndeterminate: {
      true: 'absolute animate-[indeterminate_1.5s_infinite_ease-out]',
    },
  },
  defaultVariants: {
    zType: 'default',
    zShape: 'default',
  },
});
export type ZardProgressBarVariants = VariantProps<typeof progressBarVariants>;
