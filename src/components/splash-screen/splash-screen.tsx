import { useEffect, useState } from 'react';
import './splash-screen.scss';

const SplashScreen = () => {
    const [visible, setVisible] = useState(true);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFading(true);
            setTimeout(() => setVisible(false), 700);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        setFading(true);
        setTimeout(() => setVisible(false), 700);
    };

    if (!visible) return null;

    return (
        <div className={`splash-screen ${fading ? 'splash-screen--fading' : ''}`} onClick={dismiss}>
            <div className='splash-screen__card'>
                <img
                    src='/gaddafi-ceo.jpeg'
                    alt='Gaddafi CEO'
                    className='splash-screen__image'
                />
                <div className='splash-screen__name'>Gaddafi CEO</div>
            </div>
            <p className='splash-screen__hint'>Click anywhere to continue</p>
        </div>
    );
};

export default SplashScreen;
