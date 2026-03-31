//W---------={ Reusable fadeUp animation function }=----------</br>
export const fadeUpAnimation = (y = 0, duration = 0, delay = 0) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay },
});

//W---------={ Reusable fadeRight animation function }=----------</br>
export const fadeRightAnimation = (x = 20, duration = 0.5, delay = 0) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  transition: { duration, delay },
});

//W---------={ FadeUp variants (use with custom: { y, delay }) }=----------</br>
type FadeUpCustom = { y?: number; delay?: number };

export const fadeUp = {
  hidden: (custom?: FadeUpCustom) => ({
    opacity: 0,
    y: custom?.y ?? 20,
  }),
  visible: (custom?: FadeUpCustom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom?.delay ?? 0 },
  }),
};
