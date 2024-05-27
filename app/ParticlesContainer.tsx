"use client";

import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadStarsPreset } from "@tsparticles/preset-stars";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ParticlesContainer(props: unknown) {
  const [init, setInit] = useState(false);
  const { theme, systemTheme } = useTheme();

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async engine => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      // if you are going to use `load<X>`, install the "@tsparticles/<x>" package too.
      // await loadAll(engine);
      // await loadFull(engine);
      // await loadSlim(engine);
      // await loadBasic(engine);
      await loadStarsPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // const particlesLoaded = async (container?: Container): Promise<void> => {
  //   console.log(container);
  // };

  const options: ISourceOptions = {
    preset: "stars",
    fullScreen: false,
    backgroundMask: {
      enable:
        theme === "system"
          ? systemTheme === "dark"
            ? false
            : true
          : theme === "dark"
            ? false
            : true,
      cover: { color: { value: "#fff" }, opacity: 1 },
    },
  };

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full"
        // particlesLoaded={particlesLoaded}
      />
    );
  }

  return <></>;
}
