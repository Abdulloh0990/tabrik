import React, { useState, useEffect, useRef, useCallback } from "react";
import { Music, Music as MusicOff, Gift, Heart, Sparkles, Crown, Award, Stars } from "lucide-react";

// ---------- Tug'ilgan kun hisoblash (1970 - 2026 yilda 56 yosh) ----------
function getAge() {
  const birth = new Date(1970, 8, 2); // 2-Sentyabr, 1970
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  // Agar hali 2-sentyabr kelmagan bo'lsa ham bayram kuni uchun 56 ni ko'rsatish
  return Math.max(age, 56);
}

function getDaysLived() {
  const birth = new Date(1970, 8, 2);
  const now = new Date();
  const diff = Math.max(now.getTime() - birth.getTime(), 56 * 365.25 * 24 * 60 * 60 * 1000);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ---------- Chiroyli fondagi suzuvchi zar va yuraklar ----------
function FloatingField() {
  const items = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        id: `heart-${i}`,
        type: "heart",
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 14 + Math.random() * 10,
        size: 12 + Math.random() * 16,
      });
    }
    for (let i = 0; i < 30; i++) {
      arr.push({
        id: `spark-${i}`,
        type: "spark",
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 8,
        size: 3 + Math.random() * 4,
      });
    }
    return arr;
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {items.map((it) =>
        it.type === "heart" ? (
          <div
            key={it.id}
            className="absolute opacity-0 animate-float-up"
            style={{
              left: `${it.left}%`,
              bottom: "-5%",
              animationDelay: `${it.delay}s`,
              animationDuration: `${it.duration}s`,
            }}
          >
            <Heart
              style={{ width: it.size, height: it.size }}
              className="text-rose-400/40 fill-rose-300/30 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
            />
          </div>
        ) : (
          <div
            key={it.id}
            className="absolute rounded-full opacity-0 animate-twinkle bg-amber-300/80 shadow-[0_0_10px_#f59e0b]"
            style={{
              left: `${it.left}%`,
              top: `${Math.random() * 100}%`,
              width: it.size,
              height: it.size,
              animationDelay: `${it.delay}s`,
              animationDuration: `${it.duration}s`,
            }}
          />
        )
      )}
    </div>
  );
}

// ---------- Raqamlarni sanash effekti ----------
function CountUp({ target, duration = 2000, suffix = "" }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    let raf;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

// ---------- Sharlar va Konfetti otilish effekti ----------
function useCelebrationBurst() {
  const containerRef = useRef(null);

  const burst = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const balloonColors = ["#D4AF37", "#E8B4C0", "#B5657C", "#F43F5E", "#E5C158", "#9333EA"];
    const balloonCount = 35; // Ko'proq sharlar
    const confettiCount = 65; // Konfetti va yulduzlar

    // 1. Sharlar yaratish
    for (let i = 0; i < balloonCount; i++) {
      const balloon = document.createElement("div");
      const size = 35 + Math.random() * 25;
      const startX = 10 + Math.random() * 80; // Ekranning har xil joyidan
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const duration = 4000 + Math.random() * 2500;
      const delay = Math.random() * 600;
      const drift = (Math.random() - 0.5) * 180;

      balloon.className = "absolute pointer-events-none z-50 flex flex-col items-center";
      balloon.style.left = `${startX}%`;
      balloon.style.bottom = "-100px";
      balloon.style.setProperty("--drift", `${drift}px`);
      balloon.style.animation = `balloon-fly ${duration}ms cubic-bezier(0.15, 0.8, 0.25, 1) ${delay}ms forwards`;

      // Shar tanasi va tugunchasi
      balloon.innerHTML = `
        <div style="
          width: ${size}px; 
          height: ${size * 1.25}px; 
          background: radial-gradient(circle at 35% 30%, #ffffff 0%, ${color} 70%, #000000 100%);
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          box-shadow: inset -4px -4px 10px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.15);
          position: relative;
        ">
          <div style="
            position: absolute; 
            bottom: -5px; 
            left: 50%; 
            transform: translateX(-50%);
            width: 0; height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 7px solid ${color};
          "></div>
        </div>
        <div style="
          width: 1.5px; 
          height: 45px; 
          background: rgba(212,175,55, 0.6);
        "></div>
      `;

      container.appendChild(balloon);
      setTimeout(() => balloon.remove(), duration + delay + 200);
    }

    // 2. Zarlar va konfettilar
    for (let i = 0; i < confettiCount; i++) {
      const piece = document.createElement("div");
      const isHeart = Math.random() > 0.6;
      const size = 8 + Math.random() * 12;
      const startX = 50 + (Math.random() * 40 - 20);
      const drift = Math.random() * 300 - 150;
      const fall = 500 + Math.random() * 300;
      const rotate = Math.random() * 1080 - 540;
      const duration = 3000 + Math.random() * 1800;
      const delay = Math.random() * 400;
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];

      piece.style.position = "absolute";
      piece.style.left = `${startX}%`;
      piece.style.top = "55%";
      piece.style.width = `${size}px`;
      piece.style.height = `${size}px`;
      piece.style.pointerEvents = "none";
      piece.style.zIndex = "50";
      piece.style.opacity = "0.95";
      piece.style.setProperty("--drift", `${drift}px`);
      piece.style.setProperty("--fall", `${fall}px`);
      piece.style.setProperty("--rot", `${rotate}deg`);
      piece.style.animation = `confetti-fall ${duration}ms cubic-bezier(0.2, 0.6, 0.3, 1) ${delay}ms forwards`;

      if (isHeart) {
        piece.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.1 2.4 5 5.6 5c1.9 0 3.4 1 4.4 2.5C11 6 12.5 5 14.4 5 17.6 5 19.5 8.1 22 11.7 19.5 16.4 12 21 12 21z"/></svg>`;
      } else {
        piece.style.background = color;
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
        piece.style.boxShadow = `0 0 8px ${color}`;
      }

      container.appendChild(piece);
      setTimeout(() => piece.remove(), duration + delay + 200);
    }
  }, []);

  return { containerRef, burst };
}

// ---------- Musiqa boshqaruvi tugmasi ----------
function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.8;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const startMusic = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setPlaying(true);
      setStarted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const toggle = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await audioRef.current.play();
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  // Birinchi kirishda overlay
  if (!started) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#FFFDF9]/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">💝</div>

          <h2 className="font-display text-4xl font-bold text-[#3D3128] mb-4">
            Onajon uchun maxsus sovg'a
          </h2>

          <p className="font-body text-[#6B5A4C] mb-8">
            Yurakdan tayyorlangan ushbu tabrikni musiqa bilan birga oching ❤️
          </p>

          <button
            onClick={startMusic}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#B5657C] to-[#D4AF37] text-white text-lg font-semibold shadow-xl hover:scale-105 transition-transform"
          >
            💖 Sovg'ani ochish
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/50 shadow-xl flex items-center justify-center hover:scale-110 transition-all"
    >
      {playing ? (
        <Music className="w-6 h-6 text-[#B5657C] animate-spin-slow" />
      ) : (
        <MusicOff className="w-6 h-6 text-[#8A7A6A]" />
      )}
    </button>
  );
}

// ---------- Rasmlar Galeriyasi (Linklarni shu yerdan o'zgartirasiz) ----------
const USER_PHOTOS = [
  { src: "https://cdn.phototourl.com/free/2026-09-01-e2af70e5-e97d-4908-aad6-5734709f4065.jpg", caption: "Nuroniy tabassum" },
  { src: "https://cdn.phototourl.com/free/2026-09-01-be8344d1-bff8-4cb2-97c7-6ec50a4c12c8.jpg", caption: "Go'zal lahzalar" },
  { src: "https://cdn.phototourl.com/free/2026-09-01-d18cde32-dcd4-478c-93c4-3b9a99ae0985.jpg", caption: "Oila mehri" },
  { src: "https://cdn.phototourl.com/free/2026-09-01-9ee271ff-0c4a-4601-aafe-a15fdd525394.jpg", caption: "Baxtli kunlar" },
  { src: "https://cdn.phototourl.com/free/2026-09-01-7945c27f-2260-4359-9164-30f092e62fac.jpg", caption: "Shirin xotiralar" },
  { src: "https://i.postimg.cc/Cxgx85vQ/photo-2026-09-01-20-12-25.jpg", caption: "Qalb iliqligi" },
];

function Gallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
      {USER_PHOTOS.map((p, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-3xl bg-white/40 p-2.5 backdrop-blur-md border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.25)] transition-all duration-500 hover:-translate-y-2"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <img
              src={p.src}
              alt="Oilaviy xotira"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D3128]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
              <span className="font-display italic text-white text-lg tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> {p.caption}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Asosiy Dastur Componenti ----------
export default function App() {
  const age = getAge();
  const days = getDaysLived();
  const [giftOpened, setGiftOpened] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { containerRef, burst } = useCelebrationBurst();

  const handleOpenGift = () => {
    if (giftOpened) return;
    setGiftOpened(true);
    burst();
    setTimeout(() => setShowMessage(true), 400);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#FFFDF9] via-[#FDF5EC] to-[#F8EBEF] text-[#3D3128] overflow-x-hidden font-body selection:bg-[#B5657C] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

        @keyframes float-up {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-115vh) translateX(35px) rotate(30deg); opacity: 0; }
        }
        .animate-float-up { animation: float-up linear infinite; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.6); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }

        @keyframes balloon-fly {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-125vh) translateX(var(--drift)); opacity: 0.9; }
        }

        @keyframes confetti-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.95; }
          100% { transform: translate(var(--drift), var(--fall)) rotate(var(--rot)); opacity: 0; }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0,0,0.2,1) infinite; }

        @keyframes gentle-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.08); }
        }
        .animate-gentle-glow { animation: gentle-glow 7s ease-in-out infinite; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1.1s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes card-reveal {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-card-reveal { animation: card-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>

      {/* Orqa fondagi nurli aylana effektlari */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#E8B4C0]/30 to-[#F43F5E]/10 blur-3xl animate-gentle-glow" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#D4AF37]/25 to-[#F59E0B]/10 blur-3xl animate-gentle-glow" style={{ animationDelay: "2.5s" }} />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#E8B4C0]/20 to-[#D4AF37]/15 blur-3xl animate-gentle-glow" style={{ animationDelay: "4s" }} />
      </div>

      <FloatingField />

      {/* Sharlar otiladigan konteyner */}
      <div ref={containerRef} className="fixed inset-0 z-40 pointer-events-none overflow-hidden" />

      <MusicToggle />

      <main className="relative z-10 w-full">
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-center w-full max-w-5xl mx-auto">
          
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-[#D4AF37]/40 shadow-sm text-xs sm:text-sm font-semibold tracking-widest text-[#B5657C] uppercase mb-8">
            <Crown className="w-4 h-4 text-[#D4AF37]" /> Qutlug' 56 yosh ayyomi <Crown className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <h1
            className="animate-fade-in-up font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.15] text-[#3D3128] tracking-tight"
            style={{ animationDelay: "0.15s" }}
          >
            Tug'ilgan kuningiz muborak,
            <br />
            <span className="bg-gradient-to-r from-[#B5657C] via-[#D4AF37] to-[#B5657C] bg-clip-text text-transparent italic font-normal">
              Muslima opa
            </span>{" "}
            <Heart className="inline-block w-8 h-8 sm:w-12 sm:h-12 -translate-y-2 fill-[#B5657C] text-[#B5657C] animate-pulse" />
          </h1>

          <p
            className="animate-fade-in-up font-body text-base sm:text-lg md:text-xl text-[#6B5A4C] max-w-2xl mt-8 leading-relaxed font-normal"
            style={{ animationDelay: "0.3s" }}
          >
            2-sentyabr, 1970 — qalbimizga Cheksiz Mehr, Ziyo va Saodat olib kirgan muborak kun.
          </p>

          <div
            className="animate-fade-in-up mt-12 flex flex-col items-center"
            style={{ animationDelay: "0.45s" }}
          >
            <div className="relative group cursor-default">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B5657C] opacity-30 blur-xl group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-xl border-2 border-[#D4AF37]/60 rounded-full w-36 h-36 sm:w-44 sm:h-44 flex flex-col items-center justify-center shadow-[0_15px_35px_rgba(212,175,55,0.2)]">
                <span className="font-display text-5xl sm:text-7xl font-bold text-[#B5657C] leading-none">
                  {age}
                </span>
                <span className="font-body text-xs sm:text-sm uppercase tracking-widest text-[#8A7A6A] font-semibold mt-1">
                  yosh
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MUBORAKBOD XAT SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full max-w-4xl mx-auto">
          <div className="relative group bg-white/60 backdrop-blur-xl border border-[#D4AF37]/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(181,101,124,0.12)] p-8 sm:p-14 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#D4AF37]/20 to-transparent rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <Stars className="w-7 h-7 text-[#D4AF37]" />
              <h2 className="font-display italic text-2xl sm:text-3xl font-semibold text-[#B5657C]">
                Aziz onajonim, Muslima opa!
              </h2>
            </div>

            <div className="font-body text-base sm:text-lg leading-[1.9] text-[#4A3D33] space-y-6 font-normal">
              <p>
                Sizni bugungi munavvar va shaffof kuningiz — qutlug' <strong className="text-[#B5657C] font-semibold">56 yosh</strong> tavallud ayyomingiz bilan chin qalbimdan samimiy muborakbod etaman!
              </p>
              <p>
                Siz bizning xonadonimizning fayzi, chirog'i hamda har birimizning qalbidagi eng yorug' tayanchisiz. Sabringiz, mehringiz va duolaringiz tufayli hayotimiz hamisha go'zal va mazmunli.
              </p>
              <p>
                Yuzingizdan nur va tabassum, qalbingizdan xotirjamlik hamda sog'lik-salomatlik hech qachon arimasin. Umringiz ziyoda, har bir kuningiz quvonchli xushxabarlarga boy bo'lsin.
              </p>
              <div className="pt-4 border-t border-[#D4AF37]/20">
                <p className="font-display italic text-xl text-[#B5657C]">
                  Tug'ilgan kuningiz muborak bo'lsin! ❤️
                </p>
                <p className="font-semibold text-[#3D3128] mt-2">
                  Sizni cheksiz yaxshi ko'ramiz va qadrlaymiz!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERAKTIV SOVG'A SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center w-full max-w-3xl mx-auto">
          {!showMessage ? (
            <div className="flex flex-col items-center">
              <p className="font-body text-base sm:text-lg text-[#6B5A4C] mb-8 max-w-md">
                Siz uchun maxsus bayramona syurpriz tayyorladik
              </p>
              <button
                onClick={handleOpenGift}
                disabled={giftOpened}
                className={`group relative flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#B5657C] to-[#D4AF37] bg-[length:200%_auto] text-white font-body font-semibold text-lg shadow-[0_15px_35px_rgba(181,101,124,0.35)] transition-all duration-500 hover:bg-right hover:scale-105 active:scale-95 ${
                  giftOpened ? "scale-95 opacity-60 cursor-not-allowed" : "animate-pulse"
                }`}
              >
                <Gift className="w-6 h-6 animate-bounce" />
                <span>Sovg'ani ochish</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="animate-card-reveal w-full bg-white/70 backdrop-blur-xl border border-[#D4AF37]/50 rounded-[2rem] p-10 sm:p-14 shadow-[0_20px_50px_rgba(212,175,55,0.2)]">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
                <Heart className="w-8 h-8 fill-[#B5657C] text-[#B5657C]" />
              </div>
              <h3 className="font-display italic text-2xl sm:text-4xl text-[#3D3128] leading-snug font-bold">
                "Siz — dunyodagi eng mehribon va tengsiz insonisiz!"
              </h3>
              <p className="font-body text-sm sm:text-base text-[#8A7A6A] mt-4">
                Barcha ezgu niyatlarimiz doimo siz bilan!
              </p>
            </div>
          )}
        </section>

        {/* SHANLI STATISTIKA SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-gradient-to-b from-transparent via-[#F8EBEF]/60 to-transparent w-full">
          <div className="max-w-5xl mx-auto text-center w-full">
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#3D3128] mb-3">
              56 Yillik Go'zal va Nurli Umr
            </h2>
            <p className="font-body text-[#8A7A6A] text-base sm:text-lg mb-16">1970 - 2026 yillar davomida</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full px-2">
              <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl border border-[#D4AF37]/30 shadow-sm">
                <p className="font-display text-5xl sm:text-6xl font-bold text-[#D4AF37] mb-2">
                  <CountUp target={age} />
                </p>
                <p className="font-body text-sm sm:text-base font-medium text-[#5A4C3F]">Muborak yosh</p>
              </div>
              <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl border border-[#D4AF37]/30 shadow-sm">
                <p className="font-display text-5xl sm:text-6xl font-bold text-[#B5657C] mb-2">
                  <CountUp target={days} />
                </p>
                <p className="font-body text-sm sm:text-base font-medium text-[#5A4C3F]">Mazmunli kunlar</p>
              </div>
              <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl border border-[#D4AF37]/30 shadow-sm">
                <p className="font-display text-5xl sm:text-6xl font-bold text-[#D4AF37] mb-2">∞</p>
                <p className="font-body text-sm sm:text-base font-medium text-[#5A4C3F]">Cheksiz Mehr va Duolar</p>
              </div>
            </div>
          </div>
        </section>

        {/* GALEREYA SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-6xl mx-auto w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-[#B5657C] text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4" /> Xotiralar albomi
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-center text-[#3D3128] mb-4">
            Bizning eng shirin xotiralarimiz
          </h2>
          <p className="font-body text-center text-[#8A7A6A] text-base sm:text-lg mb-14 max-w-md">
            Har bir suratda — bir olam mehr va samimiyat aks etgan
          </p>
          <Gallery />
        </section>

        {/* FOOTER */}
        <footer className="px-4 py-16 text-center w-full border-t border-[#D4AF37]/20">
          <Heart className="w-8 h-8 mx-auto mb-4 fill-[#B5657C] text-[#B5657C] animate-bounce" />
          <p className="font-display italic text-xl sm:text-2xl text-[#6B5A4C]">
            Onajon, borligingiz uchun tashakkur!
          </p>
          <p className="font-body text-xs sm:text-sm text-[#8A7A6A] mt-2">
            Hurmat va cheksiz ehtirom bilan tayyorlandi ❤️
          </p>
        </footer>
      </main>
    </div>
  );
}