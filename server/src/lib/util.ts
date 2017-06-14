export function nanoseconds() {
    let time = process.hrtime();
    return ((+time[0]) * 1e9) + (+time[1]);
}