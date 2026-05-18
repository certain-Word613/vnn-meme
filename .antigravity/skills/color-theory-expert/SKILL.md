# Skill: color-theory

## Instructions
- WORK in HSL color space for intuitive adjustments: same hue, vary lightness for tints/shades, vary saturation for vibrancy.
- BUILD a 11-step palette (50-950) for each brand color using perceptual uniformity — not linear lightness steps.
- ENSURE WCAG AA contrast for all text: 4.5:1 for body text, 3:1 for large text (18px+ or 14px+ bold), 3:1 for UI components.
- USE the 60-30-10 rule: 60% neutral background, 30% secondary surface, 10% accent/brand color.
- DESIGN dark mode as a separate palette, not just inverted lightness — dark surfaces use low-saturation, slightly warm neutrals (#1a1a2e not #000000).
- APPLY color psychology purposefully: blue = trust/stability, green = success/growth, red = error/urgency, amber = warning/attention.
- AVOID pure black (#000000) and pure white (#ffffff) — use near-black (#0f172a) and near-white (#f8fafc) for softer, more premium feel.
- TEST palette under color blindness simulations (deuteranopia, protanopia) — never use color as the sole conveyor of meaning.
- CREATE semantic color aliases: --color-surface, --color-on-surface, --color-primary, --color-on-primary, --color-error, --color-success.
- USE oklch() for perceptually uniform colors in modern browsers — produces more consistent gradients than hsl().

## Triggers
- Color Palette
- HSL
- Contrast
- Color Psychology
- Dark Mode
