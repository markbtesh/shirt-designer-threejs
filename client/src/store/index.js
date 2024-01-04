import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  isHoodie: false,
  logoDecal: './src/assets/shirt-icon.png',
  fullDecal: './threejs.png',
  logoSize: 0.15,
});

export default state;