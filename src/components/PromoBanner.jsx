import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const PromoBanner = () => {
  const navigate = useNavigate();
  const [promo, setPromo]       = useState(null);
  const [copied, setCopied]     = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await axios.get("/api/promo/featured");
        if (res.data?.promo) setPromo(res.data.promo);
      } catch {
        // no featured promo — stay hidden
      }
    };
    fetchPromo();
  }, []);

  const calcTimeLeft = useCallback(() => {
    if (!promo?.expiresAt) return null;
    const diff = new Date(promo.expiresAt) - new Date();
    if (diff <= 0) return null;
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (days > 0)  return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }, [promo]);

  useEffect(() => {
    if (!promo?.expiresAt) return;
    setTimeLeft(calcTimeLeft());
    const interval = setInterval(() => {
      const tl = calcTimeLeft();
      if (!tl) { setPromo(null); clearInterval(interval); }
      else setTimeLeft(tl);
    }, 1000);
    return () => clearInterval(interval);
  }, [promo, calcTimeLeft]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!promo) return null;

  const buildMessage = () => {
    if (promo.featuredMessage) return promo.featuredMessage;
    const parts = [`Get ${promo.value}% off`];
    if (promo.minOrderAmount > 0) parts.push(`on orders over £${promo.minOrderAmount}`);
    if (promo.remainingUses !== null && promo.remainingUses <= 20)
      parts.push(`— only ${promo.remainingUses} use${promo.remainingUses !== 1 ? "s" : ""} left`);
    return parts.join(" ");
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%, 100% { box-shadow: 0 0 0px rgba(255,255,255,0);    }
          50%       { box-shadow: 0 0 10px rgba(255,255,255,0.4); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%;   }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%;   }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;    }
          50%       { opacity: 0.6; }
        }
        .promo-code-pill {
          animation: shimmer 2.5s ease-in-out infinite;
          transition: background 0.2s, transform 0.15s;
        }
        .promo-code-pill:hover {
          background: rgba(255,255,255,0.22) !important;
          transform: scale(1.04);
        }
        .promo-shop-btn {
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .promo-shop-btn:hover {
          background:   rgba(255,255,255,0.15) !important;
          border-color: rgba(255,255,255,0.9)  !important;
          transform:    scale(1.03);
        }
      `}</style>

      <div
        style={{
          width:          "100%",
          position:       "relative",
          zIndex:         100,
          padding:        "11px 20px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          flexWrap:       "wrap",
          gap:            "14px",
          // Animated luxury gradient
          background:     "linear-gradient(270deg, #0f0f0f, #2a1800, #0f0f0f, #001a2a)",
          backgroundSize: "400% 400%",
          animation:      "gradientShift 10s ease infinite",
          // Gold accent lines top and bottom
          borderTop:    "1px solid rgba(212,175,116,0.5)",
          borderBottom: "1px solid rgba(212,175,116,0.5)",
          // Soft glow underneath to separate it from the page
          boxShadow: "0 2px 20px rgba(0,0,0,0.5)",
        }}
      >

        {/* ── Gift icon ── */}
        <span style={{ fontSize: "15px", lineHeight: 1 }}>🎁</span>

        {/* ── Message ── */}
        <span style={{
          color:         "#f0e6d3",
          fontSize:      "12px",
          letterSpacing: "0.4px",
          fontWeight:    "400",
        }}>
          {buildMessage()}
        </span>

        {/* ── Code pill ── */}
        <button
          className="promo-code-pill"
          onClick={handleCopy}
          title="Click to copy"
          style={{
            display:         "inline-flex",
            alignItems:      "center",
            gap:             "7px",
            backgroundColor: copied
              ? "rgba(255,255,255,0.22)"
              : "rgba(255,255,255,0.1)",
            border:          "1.5px dashed rgba(212,175,116,0.7)",
            borderRadius:    "5px",
            color:           "#f5e6c8",
            padding:         "4px 12px",
            fontSize:        "12px",
            letterSpacing:   "2px",
            fontWeight:      "700",
            cursor:          "pointer",
          }}
        >
          {promo.code}
          <span style={{
            fontSize:      "10px",
            fontWeight:    "400",
            letterSpacing: "0.3px",
            opacity:       0.75,
            color:         copied ? "#a8e6a3" : "#f5e6c8",
          }}>
            {copied ? "✓ Copied!" : "Copy"}
          </span>
        </button>

        {/* ── Countdown — only when expiry is set ── */}
        {timeLeft && (
          <span style={{
            display:            "inline-flex",
            alignItems:         "center",
            gap:                "5px",
            backgroundColor:    "rgba(212,175,116,0.12)",
            border:             "1px solid rgba(212,175,116,0.3)",
            borderRadius:       "5px",
            padding:            "3px 10px",
            color:              "#d4af74",
            fontSize:           "11px",
            fontVariantNumeric: "tabular-nums",
            letterSpacing:      "0.3px",
          }}>
            {/* Pulsing dot */}
            <span style={{
              width:           "6px",
              height:          "6px",
              borderRadius:    "50%",
              backgroundColor: "#d4af74",
              display:         "inline-block",
              animation:       "pulse 1.2s ease-in-out infinite",
              flexShrink:      0,
            }} />
            Ends in {timeLeft}
          </span>
        )}

        {/* ── Remaining uses warning — only when ≤20 left ── */}
        {promo.remainingUses !== null && promo.remainingUses <= 20 && (
          <span style={{
            backgroundColor: "rgba(220,80,60,0.15)",
            border:          "1px solid rgba(220,80,60,0.4)",
            borderRadius:    "5px",
            padding:         "3px 10px",
            color:           "#ff9e8e",
            fontSize:        "11px",
            letterSpacing:   "0.3px",
          }}>
            🔥 {promo.remainingUses} use{promo.remainingUses !== 1 ? "s" : ""} left
          </span>
        )}

        {/* ── Vertical divider ── */}
        <span style={{
          width:           "1px",
          height:          "18px",
          backgroundColor: "rgba(255,255,255,0.15)",
          flexShrink:      0,
        }} />

        {/* ── Shop now ── */}
        <button
          className="promo-shop-btn"
          onClick={() => navigate("/best-sellers")}
          style={{
            backgroundColor: "transparent",
            border:          "1px solid rgba(212,175,116,0.5)",
            borderRadius:    "5px",
            color:           "#d4af74",
            padding:         "4px 14px",
            fontSize:        "11px",
            letterSpacing:   "1px",
            cursor:          "pointer",
            textTransform:   "uppercase",
            fontWeight:      "500",
          }}
        >
          Shop now →
        </button>
      </div>
    </>
  );
};

export default PromoBanner;