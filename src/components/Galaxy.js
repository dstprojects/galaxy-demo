import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import '../shaders/galaxy/GalaxyMaterial'


export const Galaxy = ({ count = 200000 }) => {

    const shader = useRef()

    const [positionsArray, colorsArray, scalesArray, randomnessArray ] = useMemo(() => {

        const parameters = {}
        parameters.count = count
        parameters.size = 0.005
        parameters.radius = 5
        parameters.branches = 3
        parameters.spin = 1
        parameters.randomness = 0.5
        parameters.randomnessPower = 3
        parameters.insideColor = '#00FF4C'
        parameters.outsideColor = '#FF0072'

        const insideColor = new THREE.Color(parameters.insideColor)
        const outsideColor = new THREE.Color(parameters.outsideColor)

        const positionsArray = new Float32Array(parameters.count * 3)
        const colorsArray = new Float32Array(parameters.count * 3)
        const scalesArray = new Float32Array(parameters.count * 1)
        const randomnessArray = new Float32Array(parameters.count * 3)

        for(let i = 0; i < parameters.count; i++)
        {
            const i3 = i * 3

            // Position
            const radius = Math.random() * parameters.radius

            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            positionsArray[i3    ] = Math.cos(branchAngle) * radius 
            positionsArray[i3 + 1] = 0.0
            positionsArray[i3 + 2] = Math.sin(branchAngle) * radius 

            // Randomness

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

            randomnessArray[i3 + 0] = randomX
            randomnessArray[i3 + 1] = randomY
            randomnessArray[i3 + 2] = randomZ

            // Color
            const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / parameters.radius)

            colorsArray[i3    ] = mixedColor.r
            colorsArray[i3 + 1] = mixedColor.g
            colorsArray[i3 + 2] = mixedColor.b

            // Scale
            scalesArray[i] = Math.random()
        }

        return [positionsArray, colorsArray, scalesArray, randomnessArray]

    }, [ count ])

    useFrame((state, delta) => { 
        shader.current.time += delta
    })

    return(
        <points key={count} >
            <bufferGeometry attach="geometry">
                <bufferAttribute attachObject={['attributes', 'position']} count={count} array={positionsArray} itemSize={3} />
                <bufferAttribute attachObject={['attributes', 'color']} count={count} array={colorsArray} itemSize={3} />
                <bufferAttribute attachObject={['attributes', 'aScale']} count={count} array={scalesArray} itemSize={1} />
                <bufferAttribute attachObject={['attributes', 'aRandomness']} count={count} array={randomnessArray} itemSize={3} />
            </bufferGeometry>
            <galaxyMaterial attach="material" ref={shader} depthWrite={false} blending={ THREE.AdditiveBlending } vertexColors={ true } />

        </points>
    )

}
