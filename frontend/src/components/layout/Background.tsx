import './Background.css'
import { useState } from 'react';

const arr = Array.from({ length: 5 }, () => Math.random())

function Background() {
    return (
        <div className='bg'>
            {arr.map((n) => {
                return <BackgroundThing key={n} />
            })}
        </div>
    )
}

const randRange = (min: number, max: number) => Math.random()*(max-min)+min;

const generateGradient = () => {
    let colors = `black 0%`
    let white = true
    for (let i = 0; i < 100; i++) {
        if (Math.random() > 0.1) continue;
        const color = white ? 'white' : 'black';
        colors += `, ${color} ${i}%`
        white = !white
    }
    const deg = Math.floor(randRange(0, 360))
    return `linear-gradient(${deg}deg, ${colors})`
}

function BackgroundThing() {

    return <div className='bg-thing' style={{
        backgroundImage: generateGradient(),
    }}></div>
}

export default Background;