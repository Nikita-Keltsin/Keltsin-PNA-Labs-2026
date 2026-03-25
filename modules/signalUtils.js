// Функция анализа среднего (из getAverage.js)
export function get_average_amplitude(signal_samples) {
    if (!signal_samples || signal_samples.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < signal_samples.length; i++) {
        sum += signal_samples[i];
    }
    return sum / signal_samples.length;
}

// Функция энергии сигнала (из sumOfSquares.js)
export function get_signal_energy(signal_samples) {
    let energy_total = 0;
    let index = 0;
    const threshold = 500.0; // Пример условия для цикла

    // ТРЕБОВАНИЕ: Цикл с постусловием, не по счетчику
    if (signal_samples.length > 0) {
        do {
            energy_total += Math.pow(signal_samples[index], 2);
            index++;
        } while (index < signal_samples.length && energy_total < threshold);
    }
    
    return energy_total;
}