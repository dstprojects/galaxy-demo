import './App.css';
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo } from 'react';
import { Galaxy } from './components/Galaxy'
import create from 'zustand'
import ScrollProxy from 'scroll-proxy'

const useStore = create((set) => ({
  x: 0,
  y: 6,
  z: 0,
  changeLookAT: (position) => set(() => ({ x: position.x, y: position.y, z: position.z })),
  center: () => set({ x: 0, y: 0, z: 0 }),
}))

const Movement = () => {

  const state = useStore((state) => state)
  const vec = new THREE.Vector3()

  const { camera } = useThree()
  
  useFrame(() => {
    camera.position.lerp(vec.set(state.x, state.y, state.z), 0.01)
    camera.lookAt(0,0,0)
  })

  return(
    <Suspense >
      <Galaxy />
    </Suspense>
  )
}

function App() {

  const state = useStore((state) => state)

  const moveCamera = useCallback( (position) => {
    state.x = position.x
    state.y = position.y
    state.z = position.z
  }, [state] )

  const checkScroll = useCallback( (scrollY) => {
    if( scrollY < window.innerHeight/3){
      moveCamera({x: 0, y: 6, z: 0})
    }else if(scrollY > window.innerHeight/3 && scrollY < window.innerHeight/3 + window.innerHeight ){
      moveCamera({x: 0, y: 1, z: 8})
    }else{
      moveCamera({x: 0, y: 1, z: 2})
    }
  }, [moveCamera])

  useEffect(() => {
    window.addEventListener("scroll", (e) => {checkScroll(window.scrollY)})
    return () => {
      window.removeEventListener("scroll", (e) => {checkScroll(window.scrollY)})
    }
  }, [checkScroll])

  const s = new ScrollProxy()

  useEffect(() => {
    s.on('offsetY', function() {
      console.log("It looks like someone scrolled the X axis");
    });
    return () => {
      s.off('offsetY')
    }
  }, [s])


  return (
    <div id="canvas-container">
      <Canvas 
        camera={{position: [0,6,0]}}
      >
        <color attach="background" args={['#000']} />
        <Movement />
      </Canvas>
      <h1 className="titulo" onClick={() => {moveCamera({x: 0, y: 1, z: 8})}} >Nobrainer</h1>
    </div>      
  );
}

export default App;
