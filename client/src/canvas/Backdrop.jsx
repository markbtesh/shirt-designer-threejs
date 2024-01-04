import React, { useRef, useEffect } from 'react'
import { easing } from 'maath'
import { Canvas, useThree } from '@react-three/fiber';
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import * as THREE from 'three';

const Backdrop = () => {
    const shadows = useRef();
    const { gl, scene } = useThree(); // Access the Three.js renderer and scene

    useEffect(() => {
        // Change the background color of the scene
        scene.background = new THREE.Color('gray'); // Replace with any color you like

        // Or, if you want to change the clear color of the renderer
     // Replace with any color you like
    }, [gl, scene]);
  return (
  
        
    <AccumulativeShadows 
    ref={shadows}
    temporal
    frames={60}
    alphaTest={0.85}
    scale={5}
    rotation={[Math.PI / 2, 0, 0]}
    position={[0,0,-0.14]}>
        <RandomizedLight 
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
        />
         <RandomizedLight 
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[5, 5, -9]}
        />
        </AccumulativeShadows>
      
  )
}

export default Backdrop