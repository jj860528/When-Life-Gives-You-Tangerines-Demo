import React, { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";

function Part1Home() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const poemRef = useRef(null);
  const scrollHintRef = useRef(null);
  const notebookRef = useRef(null);
  const notebookPagesRef = useRef(null);
  const linesRef = useRef([]);
  const phaseTextRef = useRef(null);

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const phases = [
    {
      title: "青春時期",
      poem: "風吹過橘林\n詩句躍然紙上\n我還能擁有夢想嗎？",
    },
    {
      title: "中年時期",
      poem: "即使風雨來臨\n我依然願成為\n妳的橘子樹",
    },
    {
      title: "晚年時期",
      poem: "歲月帶走了青春\n卻帶不走\n我們寫下的詩",
    },
  ];

  // 實現文字分批出現的函數
  const animatePhaseContent = (index) => {
    const currentPhase = phases[index];

    // 創建一個時間軸來編排動畫序列
    const tl = gsap.timeline();

    // 先淡出舊內容
    if (index > 0) {
      tl.to(poemRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        ease: "power2.out",
      });

      tl.to(
        phaseTextRef.current,
        {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      );
    }

    // 翻頁效果
    tl.fromTo(
      notebookPagesRef.current,
      { rotationY: -5 },
      {
        rotationY: 0,
        duration: 0.8,
        ease: "power1.out",
      }
    );

    // 顯示階段標題
    tl.fromTo(
      phaseTextRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onStart: () => {
          if (phaseTextRef.current) phaseTextRef.current.textContent = currentPhase.title;
        },
      }
    );

    // 分批出現詩句的每個字
    const poemLines = currentPhase.poem.split("\n");

    // 準備詩句容器
    tl.set(poemRef.current, { innerHTML: "", opacity: 1 });

    // 逐行添加詩句
    poemLines.forEach((line, lineIndex) => {
      // 創建行容器
      const lineDiv = document.createElement("div");
      lineDiv.className = "poem-line mb-4"; // 增加行間距
      poemRef.current.appendChild(lineDiv);

      // 一個字一個字地添加到行容器中
      const chars = line.split("");
      chars.forEach((char, i) => {
        tl.add(() => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.opacity = "0";
          span.style.display = "inline-block";
          span.style.marginRight = "0.35em"; // 增加字間距
          lineDiv.appendChild(span);

          gsap.to(span, {
            opacity: 1,
            scale: char === "，" || char === "。" ? 1 : 1.1,
            duration: 0.2,
            ease: "power2.in",
          });
        }, `+=${(lineIndex * chars.length + i) * 0.1}`); // 調整時間確保行與行之間有適當間隔
      });
    });

    // 隔線動畫
    tl.fromTo(
      linesRef.current,
      { width: "70%", opacity: 0.1 },
      {
        width: "100%",
        opacity: 0.3,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
      },
      "-=0.5"
    );

    // 如果不是最後一個階段，設置下一個階段的定時器
    if (index < phases.length - 1) {
      tl.to(
        {},
        {
          duration: 6,
          onComplete: () => setCurrentPhaseIndex(index + 1),
        }
      );
    }

    return tl;
  };

  useEffect(() => {
    // 初始動畫：標題和副標題淡入
    const masterTimeline = gsap.timeline();

    masterTimeline.fromTo(
      titleRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1.2, duration: 2, ease: "power3.out" }
    );

    masterTimeline.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2, ease: "power3.out" },
      "-=1.5"
    );

    // 筆記本動畫：翻頁效果
    masterTimeline.fromTo(
      notebookRef.current,
      {
        opacity: 0,
        rotationY: -70,
        transformOrigin: "left center",
      },
      {
        opacity: 1,
        rotationY: 0,
        duration: 2.5,
        ease: "power3.out",
      },
      "-=2"
    );

    // 筆記本頁面輕微晃動
    masterTimeline.to(notebookPagesRef.current, {
      rotation: 0.5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 隔線初始動畫
    linesRef.current.forEach((line, index) => {
      masterTimeline.fromTo(
        line,
        { width: 0, opacity: 0 },
        {
          width: "100%",
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=2"
      );
    });

    // 滾動提示動畫：上下浮動
    masterTimeline.to(
      scrollHintRef.current,
      {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      },
      "-=2"
    );

    // 背景海浪動畫
    masterTimeline.to(
      containerRef.current,
      {
        backgroundPosition: "200% 0",
        duration: 20,
        repeat: -1,
        ease: "linear",
      },
      "-=2"
    );

    // 啟動第一個階段的動畫
    masterTimeline.add(() => {
      animatePhaseContent(0);
    });
  }, []);

  // 當階段索引變化時，開始該階段的動畫
  useEffect(() => {
    if (currentPhaseIndex > 0) {
      animatePhaseContent(currentPhaseIndex);
    }
  }, [currentPhaseIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-[url('/path/to/waves.png')] bg-cover bg-center relative overflow-hidden"
    >
      {/* 筆記本 */}
      <div ref={notebookRef} className="absolute inset-0 flex items-center justify-center">
        <div
          className="bg-[#fffdf0] shadow-2xl rounded-lg p-8 max-w-3xl w-full border-2 border-[#e0d6c2] perspective-1000 relative"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 31px, #e0d6c2 31px, #e0d6c2 32px)",
          }}
        >
          {/* 筆記本裝飾 - 書脊 */}
          <div className="absolute left-0 top-0 w-4 h-full bg-[#d1c4a8] rounded-l-lg transform -translate-x-3"></div>

          <div ref={notebookPagesRef} className="relative z-10">
            <h1 ref={titleRef} className="text-5xl font-bold text-orange-600 mb-4 text-center">
              苦盡柑來遇見你
            </h1>
            <h2
              ref={subtitleRef}
              className="text-2xl font-semibold text-orange-500 mb-6 text-center"
            >
              濟州島四季的愛情故事
            </h2>

            {/* 階段標題 */}
            <h3
              ref={phaseTextRef}
              className="text-xl font-semibold text-orange-500 text-center mb-3"
            >
              青春時期
            </h3>

            {/* 隔線 */}
            <div
              ref={(el) => (linesRef.current[0] = el)}
              className="h-[1px] bg-orange-300 opacity-30 my-4"
            ></div>

            <p
              ref={poemRef}
              className="text-lg italic text-gray-700 text-center leading-loose px-4 min-h-[160px] flex flex-col justify-center items-center"
            ></p>

            <div
              ref={(el) => (linesRef.current[1] = el)}
              className="h-[1px] bg-orange-300 opacity-30 my-4"
            ></div>
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
