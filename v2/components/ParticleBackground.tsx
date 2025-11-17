import React, { useRef, useEffect } from 'react';

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        interface Particle {
            x: number;
            y: number;
            radius: number;
            speedX: number;
            speedY: number;
            color: string;
            opacity: number;
        }
        
        const colors = ['#00FFFF', '#FF00FF'];
        const gridColor = 'rgba(0, 255, 255, 0.1)';
        const gridSize = 40;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const drawGrid = () => {
            if (!ctx) return;
            ctx.save();
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;

            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            ctx.restore();
        };
        
        const init = () => {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                const radius = Math.random() * 3 + 1; // Random size
                const x = Math.random() * (canvas.width - radius * 2) + radius;
                const y = Math.random() * (canvas.height - radius * 2) + radius;
                const speedX = (Math.random() - 0.5) * 0.3; // Random speed
                const speedY = (Math.random() - 0.5) * 0.3;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const opacity = Math.random() * 0.6 + 0.1; // Random intensity
                
                particles.push({ x, y, radius, speedX, speedY, color, opacity });
            }
        };

        const animate = () => {
            if(!ctx) return;
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawGrid();

            for (const particle of particles) {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
                if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
                if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;
                if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;

                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            setCanvasSize();
            init();
        };

        setCanvasSize();
        init();
        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />
    );
};

export { ParticleBackground };