import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useFBX } from '@react-three/drei';
import { X } from 'lucide-react';

interface Model3DViewerProps {
    modelPath: string;
    itemName: string;
    onClose: () => void;
}

const Model: React.FC<{ modelPath: string }> = ({ modelPath }) => {
    const fbx = useFBX(modelPath);

    useEffect(() => {
        if (fbx) {
            fbx.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
    }, [fbx]);

    return (
        <primitive
            object={fbx}
            scale={0.008}
            position={[0, -0.5, 0]}
            rotation={[0, 0, 0]}
        />
    );
};

export const Model3DViewer: React.FC<Model3DViewerProps> = ({ modelPath, itemName, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(10px)'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 30px',
                borderBottom: '1px solid #00f3ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0, 243, 255, 0.05)'
            }}>
                <div>
                    <h2 style={{
                        fontFamily: 'Orbitron',
                        color: '#00f3ff',
                        fontSize: '1.5rem',
                        marginBottom: '5px'
                    }}>
                        3D MODEL VIEWER
                    </h2>
                    <p style={{
                        fontFamily: 'Rajdhani',
                        color: '#666',
                        fontSize: '1rem'
                    }}>
                        {itemName}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: '1px solid #ff0055',
                        color: '#ff0055',
                        padding: '8px',
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* 3D Canvas */}
            <div style={{ flex: 1, position: 'relative' }}>
                <Canvas
                    camera={{ position: [2, 1, 3], fov: 45 }}
                    style={{ background: '#0a0a0a' }}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={1.2} />
                        <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
                        <directionalLight position={[-5, 3, -5]} intensity={1} />
                        <pointLight position={[0, 5, 0]} intensity={0.8} />

                        <Model modelPath={modelPath} />

                        <OrbitControls
                            enableZoom={true}
                            enablePan={true}
                            minDistance={1}
                            maxDistance={10}
                            target={[0, 0, 0]}
                        />

                        <gridHelper args={[5, 10, '#00f3ff', '#222']} position={[0, -0.5, 0]} />
                    </Suspense>
                </Canvas>

                {/* Instructions */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 243, 255, 0.1)',
                    border: '1px solid #00f3ff',
                    padding: '15px 30px',
                    fontFamily: 'Rajdhani',
                    color: '#00f3ff',
                    fontSize: '0.9rem',
                    display: 'flex',
                    gap: '30px'
                }}>
                    <span>🖱️ DRAG TO ROTATE</span>
                    <span>🔍 SCROLL TO ZOOM</span>
                </div>
            </div>
        </div>
    );
};
