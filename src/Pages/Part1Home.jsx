import React, { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";

function Part1Home() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const poemRef = useRef(null);
  const scrollHintRef = useRef(null);
  const notebookRef = useRef(null);

  const [phase, setPhase] = useState("青春時期");
  const [poem, setPoem] = useState("風吹過橘林，詩句躍然紙上，我還能擁有夢想嗎？");

  const handleNextPhase = () => {
    if (phase === "青春時期") {
      setPhase("中年時期");
      setPoem("即使風雨來臨，我依然願成為妳的橘子樹。");
    } else if (phase === "中年時期") {
      setPhase("晚年時期");
      setPoem("歲月帶走了青春，卻帶不走我們寫下的詩。");
    }
  };

  useEffect(() => {
    // 初始動畫：標題和副標題淡入
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1.2, duration: 2, ease: "power3.out" }
    );

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2, ease: "power3.out", delay: 0.5 }
    );

    // 詩句動畫：逐字淡入並放大
    gsap.fromTo(
      poemRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1.1, duration: 2.5, ease: "power3.out", delay: 1 }
    );

    // 筆記本動畫：淡入效果
    gsap.fromTo(
      notebookRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 2, ease: "power3.out", delay: 1.5 }
    );

    // 滾動提示動畫：上下浮動
    gsap.to(scrollHintRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut",
    });

    // 背景海浪動畫
    gsap.to(containerRef.current, {
      backgroundPosition: "200% 0",
      duration: 20,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-[url('/path/to/waves.png')] bg-cover bg-center relative overflow-hidden"
    >
      {/* 筆記本 */}
      <div ref={notebookRef} className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-lg p-8 max-w-3xl w-full">
          <h1 ref={titleRef} className="text-5xl font-bold text-orange-600 mb-4 text-center">
            苦盡柑來遇見你
          </h1>
          <h2 ref={subtitleRef} className="text-2xl font-semibold text-orange-500 mb-6 text-center">
            濟州島四季的愛情故事
          </h2>
          <p ref={poemRef} className="text-lg italic text-gray-700 text-center leading-relaxed">
            {poem}
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleNextPhase}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              下一階段
            </button>
          </div>
        </div>
      </div>

      {/* 滾動提示 */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-10 w-full text-center text-gray-300 text-sm"
      >
        滑動以探索更多
      </div>
    </div>
  );
}

export default Part1Home;
