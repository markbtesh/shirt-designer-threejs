import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download, plus, minus, hoodieIcon, shirtIcon } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';



const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logosShirt: true,
    stylishShirt: false,
  })

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
        case "filepicker":
          return <FilePicker 
          file={file}
          setFile={setFile}
          readFile={readFile}
          />
        case "aipicker":
          return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit} 
          />
          default:
            return null;
    }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`)
    } catch (error) {
      alert(error)
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const handleDecals = (type, result) => {
    const DecalType = DecalTypes[type];

    state[DecalType.stateProperty] = result;

    if(!activeFilterTab[DecalType.filterTab]) {
      handleActiveFilterTab(DecalType.filterTab)
    }
  }


  const handleActiveFilterTab = (tabName) => {
      switch (tabName) {
        case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
          break;
          case "stylishShirt":
            state.isFullTexture = !activeFilterTab[tabName];
            break;
            default:
              state.isFullTexture = true;
              state.isLogoTexture = false;
              break;
      }

      setActiveFilterTab((prevState) => {
        return {
          ...prevState,
          [tabName]: !prevState[tabName]
        }

      })
  }

 const handleHoodie = () => {

  state.isHoodie = !state.isHoodie

  if (state.isHoodie)
  state.logoSize += 0.2;
  if (!state.isHoodie)
  state.logoSize -= 0.2;
 }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  return (
    <AnimatePresence>
{!snap.intro && (
  <>
  <motion.div
  key="custom"
  className="absolute top-0 left-0 z-10"
  {...slideAnimation('left')}
  >

    <div className="flex items-center min-h-screen">
      <div className="editortabs-container tabs">
        {EditorTabs.map((tab) => (
          <Tab
          key={tab.name}
          tab={tab}
          handleClick={() => setActiveEditorTab(tab.name)}
          />
        ))}

        {generateTabContent()}
      </div>
    </div>
  </motion.div>

  <motion.div 
  className="absolute z-10 top-5 right-5"
  {...fadeAnimation}>

   


    <CustomButton
    type="filled"
    title="Go Back"
    handleClick={() => state.intro = true}
    customStyles="w-fit px-4 py-2.5 font-bold text-sm"
    />
  </motion.div>

 
  <motion.div 
  className="absolute z-10 top-[40%] right-5  flex flex-col"
  {...slideAnimation('right')}>

      <button className='download-btn' onClick={() => handleHoodie() }>
              <img
                src={hoodieIcon}
                alt='downsize'
                className='w-3/5 h-3/5 object-contain'
              />
            </button> 
  </motion.div>

  <motion.div className="sizetabs-container"
    {...slideAnimation('up')}
  >

<button className='size-btn' onClick={() => state.logoSize -= 0.1}>
              <img
                src={minus}
                alt='downsize'
                className='w-2/5 h-2/5 object-contain'
              />
            </button> 
      <button className='size-btn' onClick={() => state.logoSize += 0.1}>
              <img
                src={plus}
                alt='upsize'
                className='w-2/5 h-2/5 object-contain'
              />
            </button> 
  </motion.div>
  <motion.div 
    className="filtertabs-container"
    {...slideAnimation('up')}>

    
        {FilterTabs.map((tab) => (
          <Tab
          key={tab.name}
          tab={tab}
          isFilterTab
          isActiveTab={activeFilterTab[tab.name]}
          handleClick={() => handleActiveFilterTab(tab.name)}
          />
        ))}

    <button className='download-btn' onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt='download_image'
                className='w-3/5 h-3/5 object-contain'
              />
            </button>
            
    </motion.div>
  </>
)}
      </AnimatePresence>
  )
}

export default Customizer