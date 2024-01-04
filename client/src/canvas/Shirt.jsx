import React, { useRef, useState } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import { useDrag } from 'react-use-gesture';

import state from '../store';

const Shirt = () => {

    const snap = useSnapshot(state);
    const [isHovered, setIsHovered] = useState(false);
    
    const { nodes: shirtNodes, materials: shirtMaterials } = useGLTF('/shirt_baked.glb');

    // Load the second model
    const { nodes: hoodieNodes, materials: hoodieMaterials } = useGLTF('/hoodie.glb');

    const meshRef = useRef();

    const logoTexture = useTexture(snap.logoDecal);
    const fullTexture = useTexture(snap.fullDecal);
    const logoSize = snap.logoSize;


    useFrame((state, delta) => {
      easing.dampC(shirtMaterials.lambert1.color, snap.color, 0.25, delta);
      easing.dampC(hoodieMaterials.lambert1.color, snap.color, 0.25, delta);
        // update the color to the material
      meshRef.current.material.color = shirtMaterials.lambert1.color;
      meshRef.current.material.color = hoodieMaterials.lambert1.color;
      meshRef.current.material.needsUpdate = true;

       // Set aoMapIntensity to 0
       shirtMaterials.lambert1.aoMapIntensity=0;
       hoodieMaterials.lambert1.aoMapIntensity=0;

    });

    const [position, setPosition] = useState([0, 0.04, 0.15]); // Initial position

    // Set up the drag hook
    const bind = useDrag(({ movement: [mx, my] }) => {

      var hoodieSpeed = snap.isHoodie ? 0.0005 : 0.0001;

      const newX = position[0] + (mx * hoodieSpeed); // Adjust scaling factor as needed
      const newY = position[1] - (my * hoodieSpeed); // Adjust scaling factor as needed
  
      // Update the position state, keeping the Z value constant
      setPosition([newX, newY, position[2]]);
    });

    const handlePointerOver = () => {
      setIsHovered(true);
      document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
      setIsHovered(false);
      document.body.style.cursor = 'default';
  };
  

    const stateString = JSON.stringify(snap);
  return (
    <group key={stateString}>
        <mesh
          ref={meshRef}
          castShadow
          geometry={snap.isHoodie ? hoodieNodes.hoodie.geometry : shirtNodes.T_Shirt_male.geometry}
          material={snap.isHoodie ? shirtMaterials.lambert1 : hoodieMaterials.lambert1}
          material-roughness={1}
          dispose={null}
          scale={snap.isHoodie ? 0.28 : 1}
        >
            {snap.isFullTexture && (
              <Decal
                position={[0,0,0]}
                rotation={[0,0,0]}
                scale={snap.isHoodie ? 3 : 1}
                map={fullTexture}
                />
            )}

            {snap.isLogoTexture && (
              <Decal
              {...bind()}  // Apply the dragging behavior
              position={position}
                rotation={[0,0,0]}
                scale={logoSize}
                map={logoTexture}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                />
            )}
        </mesh>
        </group>
  )
}

export default Shirt