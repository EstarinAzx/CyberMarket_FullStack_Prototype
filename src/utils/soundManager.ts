// Simple sound manager using Web Audio API
class SoundManager {
    private enabled: boolean = true;
    private audioContext: AudioContext | null = null;

    constructor() {
        // Initialize on first user interaction
        if (typeof window !== 'undefined') {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    // Generate beep sound
    private createBeep(frequency: number, duration: number, volume: number = 0.1) {
        if (!this.audioContext || !this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playClick() {
        this.createBeep(800, 0.05, 0.05);
    }

    playPurchase() {
        if (!this.audioContext || !this.enabled) return;

        // Ascending notes for purchase success
        this.createBeep(450, 0.1, 0.06);
        setTimeout(() => this.createBeep(550, 0.1, 0.06), 80);
        setTimeout(() => this.createBeep(650, 0.15, 0.06), 160);
    }

    playError() {
        if (!this.audioContext || !this.enabled) return;

        // Descending harsh sound for error
        this.createBeep(200, 0.15, 0.08);
        setTimeout(() => this.createBeep(150, 0.2, 0.08), 100);
    }

    playHover() {
        this.createBeep(600, 0.03, 0.03);
    }

    toggleMute() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    isMuted() {
        return !this.enabled;
    }
}

export const soundManager = new SoundManager();
