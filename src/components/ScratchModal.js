import React, { useEffect, useRef } from "react";
import "./css/ScratchModal.css";
import { Gift, Trophy, Star, Sparkles } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { useNavigate } from "react-router-dom";
const createIconImage = (Icon, size = 24) => {
  const svgString = renderToStaticMarkup(
    <Icon size={size} strokeWidth={1.8} color="#6b6b6b" />
  );
  const img = new Image();
  img.src = "data:image/svg+xml;base64," + btoa(svgString);
  return img;
};

const ScratchModal = ({ isOpen, onClose, rewardMessage }) => {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const [revealed, setRevealed] = React.useState(false);
const navigate = useNavigate();
  useEffect(() => {
    if (!isOpen) return;
    let completed = false;

    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;

    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width;
    canvas.height = height;
    canvas.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
    });

    canvas.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    /* ---------- METALLIC SCRATCH SURFACE ---------- */

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#d7d7d7");
    gradient.addColorStop(0.5, "#f2f2f2");
    gradient.addColorStop(1, "#bcbcbc");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    /* ---------- ICON GRID PATTERN ---------- */

    const icons = [
      createIconImage(Gift, 5),
      createIconImage(Trophy, 5),
      createIconImage(Star, 5),
      createIconImage(Sparkles, 5),
    ];

    icons.forEach((img) => {
      img.onload = () => {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);

        ctx.globalAlpha = 0.25;

        const spacing = 60;
        let idx = 0;

        for (let x = -width; x < width * 2; x += spacing) {
          for (let y = -height; y < height * 2; y += spacing) {
            const icon = icons[idx % icons.length];
            ctx.drawImage(icon, x, y, 20, 20);
            idx++;
          }
        }

        ctx.restore();
        ctx.globalAlpha = 1;
      };
    });

    /* ---------- SCRATCH LOGIC ---------- */

    let isDrawing = false;

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    };

    const autoClearSurface = () => {
      let radius = 0;
      const maxRadius = Math.sqrt(width * width + height * height);

      const clearAnimation = () => {
        ctx.globalCompositeOperation = "destination-out";

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        ctx.fill();

        radius += 8; // speed of reveal

        if (radius < maxRadius) {
          requestAnimationFrame(clearAnimation);
        } else {
          //  surface fully cleared
          setRevealed(true);   // start shine

          setTimeout(() => {
            onClose();  // parent handles navigate("/MyOrders")
          }, 5000);
        }
      };

      clearAnimation();
    };



    const checkScratchCompletion = () => {
      if (completed) return;   // 🔥 prevent multiple triggers

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      let cleared = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
          cleared++;
        }
      }

      const totalPixels = pixels.length / 4;
      const percent = (cleared / totalPixels) * 100;

      if (percent > 60) {
        completed = true;        // 🔥 lock
        autoClearSurface();
      }
    };


    const handleMove = (clientX, clientY) => {
      const r = canvas.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;

      scratch(x, y);

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    };

    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;

      if (isDrawing) {
        scratch(x, y);
        checkScratchCompletion();
      }
    };


    const onTouchMove = (e) => {
      e.preventDefault(); // prevent scrolling

      const touch = e.touches[0];
      const r = canvas.getBoundingClientRect();
      const x = touch.clientX - r.left;
      const y = touch.clientY - r.top;

      scratch(x, y);
      checkScratchCompletion(); // 🔥 NOW WORKS ON MOBILE
    };

    canvas.addEventListener("touchstart", () => (isDrawing = true), {
      passive: false,
    });

    canvas.addEventListener("touchend", () => (isDrawing = false));

    canvas.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });


    canvas.addEventListener("mousedown", () => (isDrawing = true));
    canvas.addEventListener("mouseup", () => (isDrawing = false));
    canvas.addEventListener("mouseleave", () => (isDrawing = false));
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
  <div className="scratch-overlay">
  <div className="scratch-modal">

    {/* 🔥 Skip Button */}
    <button
      className="scratch-skip-btn"
      onClick={() => {
        onClose?.();           // close modal if needed
        navigate("/MyOrders"); // 🔥 navigate
      }}
    >
      Skip
    </button>

    <h2 className="modal-title">🎁 Congratulations!</h2>
    <p className="modal-subtitle">
      You’ve unlocked a surprise reward
    </p>

    <div className="scratch-card">
      <div className="reward-text">
        {rewardMessage || "🎉 You Won a Surprise Reward!"}
      </div>

      <canvas
        ref={canvasRef}
        className="scratch-layer"
      />

      <div
        ref={cursorRef}
        className="scratch-cursor"
      />
    </div>

  </div>
</div>
  );
};

export default ScratchModal;
