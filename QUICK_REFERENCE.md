# Quick Reference Cheat Sheet

## React Hooks Quick Reference

### useState

```javascript
const [value, setValue] = useState(initialValue);
setValue(newValue); // Update state
```

### useEffect

```javascript
useEffect(() => {
  // Runs after render
}, [dependency]); // Empty [] = once, [dep] = when dep changes
```

### useNavigate (React Router)

```javascript
const navigate = useNavigate();
navigate("/path"); // Navigate to route
```

## Common CSS Properties

### Layout

- `display: grid` - Grid layout
- `display: flex` - Flexbox layout
- `grid-template-columns: repeat(auto-fill, minmax(350px, 1fr))` - Responsive grid
- `gap: 24px` - Space between items
- `justify-content: center` - Center horizontally (flex)
- `align-items: center` - Center vertically (flex)

### Positioning

- `position: relative/absolute/fixed` - Positioning context
- `top/left/right/bottom: 0` - Offsets
- `z-index: 2` - Stacking order

### Sizing

- `width: 100%` - Full width
- `height: 100vh` - Full viewport height
- `padding: 24px` - Inner spacing
- `margin: 0 auto` - Center horizontally

### Colors & Backgrounds

- `background: linear-gradient(135deg, #667eea, #764ba2)` - Gradient
- `background: rgba(255, 255, 255, 0.1)` - Semi-transparent
- `color: white` - Text color
- `border-radius: 20px` - Rounded corners

### Effects

- `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)` - Shadow
- `backdrop-filter: blur(20px)` - Glass effect
- `opacity: 0.5` - Transparency
- `transform: translateY(-8px)` - Move element

### Typography

- `font-size: 1.4rem` - Text size
- `font-weight: 600` - Boldness
- `text-align: center` - Alignment
- `line-height: 1.6` - Line spacing

### Interactions

- `transition: all 0.3s ease` - Smooth animations
- `cursor: pointer` - Hand cursor
- `:hover` - Mouse over state
- `:focus` - Focused state

## JavaScript Patterns

### Async/Await

```javascript
async function fetchData() {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
```

### Array.map()

```javascript
items.map((item) => <div key={item.id}>{item.name}</div>);
```

### Template Literals

```javascript
`Hello ${name}`; // Instead of "Hello " + name
```

### Destructuring

```javascript
const { name, age } = user; // Instead of user.name, user.age
```

## Common Patterns in Your Code

### Fetching Data

```javascript
useEffect(() => {
  axios.get(url, { headers: {...} })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
}, [dependency]);
```

### Handling Events

```javascript
onClick={() => handleClick(id)}
onChange={(e) => setValue(e.target.value)}
```

### Conditional Rendering

```javascript
{
  condition ? <ComponentA /> : <ComponentB />;
}
{
  condition && <Component />;
}
```

### File Upload

```javascript
const formData = new FormData();
formData.append("file", file);
axios.post(url, formData, { headers: {...} });
```

## CSS Units Explained

- `px` - Pixels (absolute)
- `%` - Percentage of parent
- `rem` - Relative to root font size (usually 16px)
- `em` - Relative to parent font size
- `vh` - Viewport height (1vh = 1% of screen height)
- `vw` - Viewport width (1vw = 1% of screen width)
- `fr` - Fraction (in Grid, shares available space)

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
}

/* Tablet */
@media (max-width: 768px) {
}

/* Desktop */
@media (min-width: 769px) {
}
```

## Common CSS Values

### Colors

- `white`, `black` - Named colors
- `#ff6b6b` - Hex color
- `rgb(255, 107, 107)` - RGB color
- `rgba(255, 107, 107, 0.5)` - RGB with opacity

### Font Weights

- `300` - Light
- `400` - Normal (default)
- `600` - Semi-bold
- `700` - Bold

### Border Styles

- `solid` - Solid line
- `dashed` - Dashed line
- `dotted` - Dotted line
- `none` - No border

## Animation Timing Functions

- `ease` - Slow start, fast middle, slow end (default)
- `linear` - Constant speed
- `ease-in` - Slow start
- `ease-out` - Slow end
- `ease-in-out` - Slow start and end

## Z-Index Guidelines

- `0-10` - Base content
- `10-100` - Overlays, modals
- `100+` - Tooltips, dropdowns

## Flexbox Quick Guide

```css
.container {
  display: flex;
  flex-direction: row; /* or column */
  justify-content: center; /* main axis */
  align-items: center; /* cross axis */
  gap: 20px; /* space between */
}
```

## Grid Quick Guide

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 20px; /* space between */
}
```
