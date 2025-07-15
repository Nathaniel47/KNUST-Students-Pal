import React from "react";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TopWave = () => (
  <Svg
    width={width}
    height={100}
    viewBox={`0 0 ${width} 100`}
    style={{ position: "absolute", top: 0 }}
  >
    <Path
      d={`M0,0 C${width / 4},100 ${
        (width * 3) / 4
      },0 ${width},100 L${width},0 L0,0 Z`}
      fill="#00BF63"
    />
  </Svg>
);

export const BottomWave = () => (
  <Svg
    width={width}
    height={100}
    viewBox={`0 0 ${width} 100`}
    style={{ position: "absolute", bottom: 0 }}
  >
    <Path
      d={`M0,100 C${width / 4},0 ${
        (width * 3) / 4
      },100 ${width},0 L${width},100 L0,100 Z`}
      fill="#00BF63"
    />
  </Svg>
);

// components/AnimatedWave.js
// import React, { useEffect } from 'react';
// import Svg, { Path } from 'react-native-svg';
// import { Dimensions } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedProps,
//   withRepeat,
//   withTiming,
// } from 'react-native-reanimated';

// const { width } = Dimensions.get('window');
// const height = 100;

// const AnimatedPath = Animated.createAnimatedComponent(Path);

// export const AnimatedTopWave = () => {
//   const progress = useSharedValue(0);

//   useEffect(() => {
//     progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
//   }, []);

//   const animatedProps = useAnimatedProps(() => {
//     const cp1Y = 50 + 30 * Math.sin(progress.value * Math.PI * 2);
//     const cp2Y = 50 - 30 * Math.sin(progress.value * Math.PI * 2);
//     const d = `M0,0 C${width / 4},${cp1Y} ${(width * 3) / 4},${cp2Y} ${width},100 L${width},0 L0,0 Z`;
//     return { d };
//   });

//   return (
//     <Svg
//       width={width}
//       height={height}
//       viewBox={`0 0 ${width} ${height}`}
//       style={{ position: 'absolute', top: 0 }}
//     >
//       <AnimatedPath fill="#00BF63" animatedProps={animatedProps} />
//     </Svg>
//   );
// };

// export const AnimatedBottomWave = () => {
//   const progress = useSharedValue(0);

//   useEffect(() => {
//     progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
//   }, []);

//   const animatedProps = useAnimatedProps(() => {
//     const cp1Y = 50 - 30 * Math.sin(progress.value * Math.PI * 2);
//     const cp2Y = 50 + 30 * Math.sin(progress.value * Math.PI * 2);
//     const d = `M0,100 C${width / 4},${cp1Y} ${(width * 3) / 4},${cp2Y} ${width},0 L${width},100 L0,100 Z`;
//     return { d };
//   });

//   return (
//     <Svg
//       width={width}
//       height={height}
//       viewBox={`0 0 ${width} ${height}`}
//       style={{ position: 'absolute', bottom: 0 }}
//     >
//       <AnimatedPath fill="#00BF63" animatedProps={animatedProps} />
//     </Svg>
//   );
// };
