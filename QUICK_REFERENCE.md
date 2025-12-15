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

````css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 20px; /* space between */
}
```===========================
Here’s a clear, practical guide to debugging a React application—step by step—covering Console, Network, CSS, and applying fixes. This is exactly what you’ll use in real projects like your LMS React frontend.

1️⃣ Open Developer Tools (Most Important)

In Chrome / Edge / Brave:

Right click → Inspect

OR press F12

OR Ctrl + Shift + I

You’ll see tabs like:

Elements

Console

Network

Sources

Application

2️⃣ Console Tab – Check Errors & Logs 🧠
🔴 Check Runtime Errors

Go to Console tab:

Red ❌ → errors (must fix)

Yellow ⚠️ → warnings

White → logs

Example error:

Uncaught TypeError: Cannot read property 'name' of undefined


👉 Means:

user.name // but user is undefined

🧪 Use console.log() for Debugging
console.log("user data:", user);
console.log("token:", localStorage.getItem("token"));


Useful logs:

console.log(props);
console.log(state);
console.log(response.data);


📌 Tip: Remove logs before production.

3️⃣ Network Tab – Debug API Calls (VERY IMPORTANT) 🌐
📍 Where to Go

Open Network tab

Refresh the page

Filter by:

Fetch/XHR → API calls

🔍 Check API Request Details

Click any API call → check:

1️⃣ Headers

Request URL

Method (GET / POST)

Authorization token

Example:

Authorization: Bearer eyJhbGciOiJIUzI1Ni...


❌ If token missing → user not authenticated

2️⃣ Payload (Request Body)

For POST/PUT:

{
  "email": "test@gmail.com",
  "password": "123456"
}


If payload wrong → backend won’t work

3️⃣ Response

200 / 201 → success ✅

401 → Unauthorized (JWT issue)

403 → Forbidden (role issue)

500 → Backend error

Example response:

{
  "message": "Invalid token"
}

4️⃣ Elements Tab – Debug HTML & CSS 🎨
🔎 Inspect Elements

Click Elements

Hover over HTML → see UI highlight

Click element → see CSS on right side

🎨 Check Applied CSS

Right panel shows:

Applied styles

Overridden styles (❌ crossed out)

Example:

button {
  background-color: red;
}


Crossed ❌ means:

Another CSS is overriding it

🛠 Change CSS Live

You can edit CSS directly:

width: 300px;
padding: 10px;
background: blue;


⚠️ Changes are temporary → copy to your .css file.

5️⃣ How to Find Which CSS File Is Applied 📂

In Elements → Styles:

.login-btn { }
Login.css:23


👉 Means:

CSS comes from Login.css

Line number 23

6️⃣ Common CSS Debugging Tricks
❌ Element Not Visible?

Check:

display: none;
visibility: hidden;
opacity: 0;

❌ Width / Height Not Working?

Check parent:

display: flex;


Then apply:

flex: 1;

❌ Center Element
display: flex;
justify-content: center;
align-items: center;

7️⃣ React DevTools (Highly Recommended) ⚛️
🔧 Install Extension

Chrome → React Developer Tools

New tabs appear:

Components

Profiler

🧩 Components Tab

Check:

Props

State

Hooks values

Example:

state:
  courses: []
  loading: false


If empty → API not called or failed

8️⃣ Debugging useEffect() Issues
❌ API Called Infinite Times?
useEffect(() => {
  fetchData();
});


✅ Fix:

useEffect(() => {
  fetchData();
}, []);

❌ Dependency Missing?
useEffect(() => {
  fetchCourse(id);
}, [id]);

9️⃣ Application Tab – Check Storage 🗄️

Go to:
Application → Local Storage

Check:

JWT token

user role

userId

Example:

token: eyJhbGciOi...
role: STUDENT


❌ If missing → login issue

🔟 Typical Debugging Flow (Real Project)

UI broken → Elements

Button click not working → Console

API not working → Network

Data not rendering → React DevTools

Auth issue → Application → Local Storage

🧠 Pro Tips (For Your LMS Project)

Always check Network first for API issues

Use console.log(response.data) after API calls

Inspect JWT token in headers

CSS issue? → check overridden styles

Use React DevTools daily
````
