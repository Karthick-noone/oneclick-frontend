// import React, { useState } from "react";
// import "./css/AuthForm.css";

// const ColorFill = () => {
//   const [filled, setFilled] = useState(false);

//   const handleClick = () => {
//     setFilled(true);
//   };

//   return (
//     <div className="container">
//       <div className={`color-side ${filled ? "filled" : ""}`}></div>
//       <button className="switch-btn" onClick={handleClick}>
//         Fill Color
//       </button>
//     </div>
//   );
// };

// export default ColorFill;
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }

// body, html, #root {
//   height: 100%;
//   width: 100%;
//   font-family: sans-serif;
// }

// .container {
//   position: relative;
//   height: 100vh;
//   width: 100%;
//   overflow: hidden;
// }

// /* Green color side */
// .color-side {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: #4ea685;
//   z-index: 1;
//   transition: clip-path 1s ease; /* animate diagonal change */
//   clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%); /* diagonal shape stays */
// }

// /* After click, fill entire page with diagonal extending to 100% */
// .color-side.filled {
//   clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
// }

// /* Button styling */
// .switch-btn {
//   position: absolute;
//   top: 20px;
//   left: 50%;
//   transform: translateX(-50%);
//   padding: 10px 20px;
//   font-size: 16px;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   background-color: #fff;
//   box-shadow: 0 4px 6px rgba(0,0,0,0.2);
//   z-index: 2;
// }
