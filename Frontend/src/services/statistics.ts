import { mean as sMean, standardDeviation } from 'simple-statistics'

export function avg(length: number, values: number[]): number {
    let sum: number = 0;
    for (let i = 0; i < length; i++) {
        sum += values[i];
    }
    let avg: number = (sum / length) || 0;
    return avg;
}

export function mean(values: number[]) {
    return sMean(values);
}

export function std(values: number[]) {
    return standardDeviation(values);
}