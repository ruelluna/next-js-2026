# Theme Configuration

This document maps each theme preset to its configuration file and how to change it.

## Config Locations

| Setting | File | Changeable Later? |
|---------|------|-------------------|
| Component Library (Radix/Base) | `components.json` → `style` | No (requires `npx shadcn add --all --overwrite`) |
| Style (Vega, Nova, Maia, Lyra, Mira) | `components.json` → `style` | No |
| Theme/Base Color | `components.json` → `tailwind.baseColor` | No |
| Icon Library | `components.json` → `iconLibrary` | Yes |
| Menu Color | `components.json` → `menuColor` | Yes |
| Menu Accent | `components.json` → `menuAccent` | Yes |
| Radius | `app/globals.css` → `--radius` | Yes |
| Theme Colors | `app/globals.css` → `:root` / `.dark` | Yes |
| Font | `app/layout.tsx` | Yes |

## Preset Options

**style** (in `components.json`):
- `radix-vega` | `radix-nova` | `radix-maia` | `radix-lyra` | `radix-mira`
- `base-vega` | `base-nova` | `base-maia` | `base-lyra` | `base-mira`

**tailwind.baseColor**: `gray` | `neutral` | `slate` | `stone` | `zinc`

**iconLibrary**: `lucide` | `tabler` | `heroicons` | `phosphor` | `remixicon`

**menuColor**: `default` | `inverted`

**menuAccent**: `subtle` | `bold`

**--radius** (in `globals.css`): `0.375rem` (sm) | `0.625rem` (default) | `0.75rem` (lg) | `9999px` (full)

## Changing the Config

| Action | Steps |
|--------|-------|
| Change radius | Edit `--radius` in `app/globals.css` |
| Change theme colors | Edit CSS variables in `app/globals.css` (`:root` and `.dark`) |
| Change icon library | Edit `iconLibrary` in `components.json` |
| Change menu color/accent | Edit `menuColor` / `menuAccent` in `components.json` |
| Change font | Edit `app/layout.tsx` (next/font import) |
| Change style | Edit `style` in `components.json`, then run `npx shadcn add --all --overwrite` |
| Change base color | Edit `tailwind.baseColor`, then run `npx shadcn add --all --overwrite` |
