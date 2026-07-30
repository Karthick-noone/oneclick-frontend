import React, { useEffect, useRef, useState } from "react";
import "./css/ScratchCard.css";
import { Gift, Trophy, Star, Sparkles } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import Footer from "./footer";

/* ===== ICON IMAGE CREATOR ===== */
const rewardCreateIconImage = (Icon, size = 24) => {
  const svgString = renderToStaticMarkup(
    <Icon size={size} strokeWidth={1.8} color="#ffffff" />
  );
  const img = new Image();
  img.src = "data:image/svg+xml;base64," + btoa(svgString);
  return img;
};

const RewardScratchCardItem = ({
  rewardText,
  rewardId,
  isScratched,
  rewardMinOrder,
  rewardValidity,
  rewardBg,
  rewardSurfaceLight,
  rewardSurfaceDark,
  isExpired,
  isClaimed,
  rewardIcon: Icon,

}) => {

  const rewardCanvasRef = useRef(null);
  const rewardCardRef = useRef(null);

  useEffect(() => {
    if (isClaimed || isScratched || isExpired) return;

    const canvas = rewardCanvasRef.current;
    const card = rewardCardRef.current;
    const ctx = canvas.getContext("2d");

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width;
    canvas.height = height;

    /* ===== COLORED METALLIC SURFACE (FIXED) ===== */
    const gradient = ctx.createLinearGradient(0, 0, width, height);

    gradient.addColorStop(0, rewardSurfaceDark);
    gradient.addColorStop(0.4, rewardSurfaceLight);
    gradient.addColorStop(0.6, rewardSurfaceLight);
    gradient.addColorStop(1, rewardSurfaceDark);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);


    /* ===== ROTATED ICON GRID (Same as Modal) ===== */
    const icons = [
      rewardCreateIconImage(Gift, 5),
      rewardCreateIconImage(Trophy, 5),
      rewardCreateIconImage(Star, 5),
      rewardCreateIconImage(Sparkles, 5),
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

    /* ===== SCRATCH LOGIC ===== */
    let rewardDrawing = false;
    let rewardCompleted = false;

    const rewardScratch = (x, y) => {
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

        radius += 8; // 🔥 reveal speed

        if (radius < maxRadius) {
          requestAnimationFrame(clearAnimation);
        } else {
          // surface fully cleared
          ctx.clearRect(0, 0, width, height);
        }
      };

      clearAnimation();
    };

    const rewardCheckCompletion = () => {
      if (rewardCompleted) return;

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let cleared = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) cleared++;
      }

      const percent = (cleared / (pixels.length / 4)) * 100;

      if (percent > 60) {
        rewardCompleted = true;
        rewardDrawing = false;

        autoClearSurface();

        //  Call backend to mark scratched
        axios.put(`${ApiUrl}/api/scratch-reward/${rewardId}`)
          .then(() => {
            console.log("✅ Marked as scratched");
          })
          .catch(err => {
            console.error("❌ Scratch update failed", err);
          });
      }

    };


    const rewardGetXY = (e) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: (e.clientX || e.touches[0].clientX) - r.left,
        y: (e.clientY || e.touches[0].clientY) - r.top,
      };
    };

    const rewardHandleMove = (e) => {
      if (!rewardDrawing) return;
      const { x, y } = rewardGetXY(e);
      rewardScratch(x, y);
      rewardCheckCompletion();
    };

    canvas.addEventListener("mousedown", () => (rewardDrawing = true));
    canvas.addEventListener("mouseup", () => (rewardDrawing = false));
    canvas.addEventListener("mouseleave", () => (rewardDrawing = false));
    canvas.addEventListener("mousemove", rewardHandleMove);

    canvas.addEventListener("touchstart", () => (rewardDrawing = true));
    canvas.addEventListener("touchend", () => (rewardDrawing = false));
    canvas.addEventListener("touchmove", rewardHandleMove);

    return () => {
      canvas.removeEventListener("mousemove", rewardHandleMove);
    };
  }, [isExpired, isClaimed]);

  return (
    <div
      className={`reward-card ${isExpired && !isClaimed ? "reward-expired" : ""
        }`}
         ref={rewardCardRef}
      style={{ background: rewardBg }}
    >
      {isClaimed && <div className="reward-claimed-badge">CLAIMED</div>}

      <div className="reward-card-content">
        <div className="reward-title-row">
          {Icon && <Icon size={22} className="reward-icon" />}
          <span className="reward-card-text">{rewardText}</span>
        </div>

        {rewardMinOrder && (
          <div className="reward-min-order">
            {rewardMinOrder}
          </div>
        )}

        {!isExpired && !isClaimed && (

          <div className="reward-validity">
            {rewardValidity}
          </div>
        )}

      </div>



      <canvas
        ref={rewardCanvasRef}
        className="reward-scratch-layer"
      />

      {/* {isExpired && (
        <div className="reward-expired-watermark">EXPIRED</div>
      )} */}


    </div>
  );
};

/* ===== PAGE ===== */
const ScratchCard = () => {
  const [rewardList, setRewardList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const user_id = localStorage.getItem("user_id");

        if (!user_id) {
          console.log("❌ No user_id found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${ApiUrl}/api/user-rewards/${user_id}`
        );

        const rewards = response.data?.data || [];

        const gradients = [
         
          {
            bg: "linear-gradient(135deg,#ff512f,#dd2476)",
            light: "#fecaca",
            dark: "#f87171",
          },
          {
            bg: "linear-gradient(135deg,#00c6ff,#0072ff)",
            light: "#bae6fd",
            dark: "#38bdf8",
          },
          {
            bg: "linear-gradient(135deg,#11998e,#38ef7d)",
            light: "#bbf7d0",
            dark: "#4ade80",
          },
          {
            bg: "linear-gradient(135deg,#8e2de2,#4a00e0)",
            light: "#e9d5ff",
            dark: "#c084fc",
          },
           {
            bg: "linear-gradient(135deg,#4e73df,#224abe)",
            light: "#bfdbfe",
            dark: "#60a5fa",
          },
        ];

        const icons = [Gift, Trophy, Star, Sparkles];

        const formattedRewards = rewards.map((reward, index) => {

          const colorSet = gradients[index % gradients.length];
          const SelectedIcon = icons[index % icons.length];

          const isExpired =
            reward.expiry_date &&
            new Date(reward.expiry_date) < new Date();

          return {
            id: reward.user_reward_id, // ✅ IMPORTANT FIX

            text:
              reward.discount_type === "percentage"
                ? `${reward.discount_value}% OFF`
                : `₹${reward.discount_value} OFF`,

            Icon: SelectedIcon,

            minOrderText:
              reward.min_order_amount > 0
                ? `On orders above ₹${reward.min_order_amount}`
                : null,

            validityText: reward.expiry_date
              ? `Valid till ${new Date(
                reward.expiry_date
              ).toLocaleDateString()}`
              : "",

            bg: colorSet.bg,
            surfaceLight: colorSet.light,
            surfaceDark: colorSet.dark,

            expired: isExpired,
            claimed: reward.is_used === 1,
            scratched: reward.is_scratched === 1,
          };
        });

        setRewardList(formattedRewards);

      } catch (error) {
        console.error("❌ Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);






  return (
    <>

      <div className="reward-page">
        <h1 className="reward-page-title"> Rewards</h1>
        {!loading && rewardList.length === 0 && (
          <div className="no-rewards-container">
            <div className="no-rewards-icon">
              <Gift size={60} strokeWidth={2} color="#facc15" />
              <Sparkles
                size={24}
                strokeWidth={2}
                color="#ffffff"
                className="sparkle-icon"
              />
            </div>
            <h3>No Rewards Yet</h3>
            <p>Place more orders to unlock exciting rewards!</p>
          </div>
        )}



        <div className="reward-grid">
          {rewardList.map((item, index) => (
            <RewardScratchCardItem
              key={index}
              rewardText={item.text}
              rewardId={item.id}
              rewardMinOrder={item.minOrderText}
              rewardIcon={item.Icon}
              rewardValidity={item.validityText}
              rewardBg={item.bg}
              rewardSurfaceLight={item.surfaceLight}
              rewardSurfaceDark={item.surfaceDark}
              isExpired={item.expired}
              isClaimed={item.claimed}
              isScratched={item.scratched}

            />

          ))}
        </div>

      </div>
      <Footer />

    </>
  );
};

export default ScratchCard;

