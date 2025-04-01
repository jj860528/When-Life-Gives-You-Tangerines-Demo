import React, { useEffect, useRef, useState } from "react";

import { createNoise2D } from "simplex-noise";

const BgWavyLines = ({
  lineGap = 10, // 線條間距
  pointGap = 10, // 點的間距
  lineColor = "#999", // 線條顏色
  effect = "none", // 特效類型，如風吹、波浪等
  mouseInteraction = { type: "smear" }, // 滑鼠交互效果
  children,
}) => {
  const boxRef = useRef(null); // 參考 div 容器
  const canvasRef = useRef(null); // 參考 canvas 畫布

  // 設定 box 大小的狀態
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });
  const [mouse, setMouse] = useState({ elementX: 0, elementY: 0, isOutside: true }); // 滑鼠位置
  const [pMouse, setPMouse] = useState({ px: 0, py: 0 }); // 上一個滑鼠位置
  const [rippleMap, setRippleMap] = useState(new Map()); // 存儲點擊後產生的漣漪效果
  const [fps, setFps] = useState(0); // 每秒幀數

  const noise = createNoise2D(); // 產生 2D 噪音，用於動畫效果

  // 監聽視窗大小變化，動態更新 box 尺寸
  useEffect(() => {
    const handleResize = () => {
      if (boxRef.current) {
        setBoxSize({
          width: boxRef.current.clientWidth,
          height: boxRef.current.clientHeight,
        });
      }
    };

    handleResize(); // 初始加載時執行一次
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 畫布渲染與動畫更新
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr); // 設置畫布比例，確保高清顯示

    const updateCanvasSize = () => {
      canvasRef.current.width = boxSize.width * dpr;
      canvasRef.current.height = boxSize.height * dpr;
    };
    updateCanvasSize();

    const handleAnimation = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      setFps(Math.round(1000 / delta)); // 計算 FPS

      const context = ctx;
      context.clearRect(0, 0, boxSize.width, boxSize.height); // 清除畫布
      context.strokeStyle = lineColor; // 設置線條顏色
      context.lineWidth = 1;

      // 在這裡添加繪製邏輯，例如線條動畫

      requestAnimationFrame(handleAnimation);
    };

    let lastFrameTime = performance.now();
    requestAnimationFrame(handleAnimation);

    return () => cancelAnimationFrame(handleAnimation);
  }, [boxSize, lineColor]);

  // 處理點擊事件，產生漣漪效果
  const handleClick = () => {
    if (mouseInteraction.type === "ripple" && boxRef.current) {
      const { elementX, elementY } = mouse;
      setRippleMap(
        new Map(rippleMap.set(crypto.randomUUID(), { x: elementX, y: elementY, radius: 0 }))
      );
    }
  };

  return (
    <div ref={boxRef} className="relative" onClick={handleClick}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {children({ fps })} {/* 傳遞 FPS 給子組件，保持與 Vue 插槽類似的行為 */}
    </div>
  );
};

export default BgWavyLines;
