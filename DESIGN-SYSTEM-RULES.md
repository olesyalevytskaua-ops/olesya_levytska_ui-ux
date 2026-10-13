# Portfolio design-system rules

## Interaction affordances

Non-interactive elements must not have hover styling that implies they can be clicked. Static expertise cards, skill chips, tool chips, labels and informational panels keep the same appearance on hover: no lift, scale, border highlight, color change or pointer cursor.

Reserve interactive hover and focus styling for working links, buttons and other genuine controls. Use semantic elements and keep visible keyboard focus on interactive controls. Decorative icons remain hidden from screen readers when the adjacent text already provides the name.

A paused animation on hover is allowed when it helps people read moving content; it must not visually imply that the content is clickable.

## Print and PDF

CV printing and PDF export always use the light palette with dark text on white paper, regardless of the website theme. Print rules must not change the screen theme or the saved user preference.

## Moving content

Automatically scrolling content that runs longer than five seconds must have an always-discoverable pause/resume mechanism. Use a keyboard- and touch-accessible button with a clear action label and visible focus. A pause must persist after focus or the pointer leaves the content. Show a pause icon while moving and a play icon while paused. Respect prefers-reduced-motion with a static, wrapping alternative; hide the unnecessary playback control in that mode.

## Scroll-linked motion

Prefer motion tied to the visitor's own scroll over motion that runs on its own. Scroll-linked content moves only while the page scrolls and stops the moment scrolling stops, so it never starts automatically and needs no pause control. Keep it calm: move at a fraction of the scroll distance (the skills line uses 0.6×) and never past the end of the content. Respect prefers-reduced-motion, missing JavaScript and print with a static, wrapping version that shows every item. Keep all text in the page so screen readers get the full content.

## Entrance motion

Use short, one-time dissolves as content enters view, with restrained staggering for peer cards. Entrance animation does not imply clickability; static cards retain no hover treatment. Respect reduced motion, keep keyboard-focused content visible immediately, and show every block in print/PDF. Without JavaScript or IntersectionObserver, content must remain visible.
